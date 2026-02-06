import logging
import asyncio
from typing import List
from langgraph.graph import StateGraph, END
from langchain_core.language_models import BaseChatModel

from .state import PipelineState, QuestionState
from .nodes.reference_mapper import ReferenceMapperNode
from .question_graph import create_question_graph

logger = logging.getLogger(__name__)

# Rate Limit 보호를 위한 Semaphore (동시 실행 수 제한)
PARALLEL_LIMIT = 2
question_semaphore = asyncio.Semaphore(PARALLEL_LIMIT)

class PipelineGraph:
    """전체 자소서 생성 파이프라인 그래프"""
    
    def __init__(self, llm: BaseChatModel, openai_api_key: str):
        self.llm = llm
        self.openai_api_key = openai_api_key
        self.question_graph = create_question_graph(llm, openai_api_key)
        self.reference_mapper = ReferenceMapperNode(llm)
        
    def create_graph(self):
        workflow = StateGraph(PipelineState)
        
        # 1. 전처리 노드 (Reference Mapping)
        workflow.add_node("preprocess_reference", self.reference_mapper)
        
        # 2. 병렬 문항 처리 노드 (Phase 3 최적화)
        async def process_single_question(idx: int, question: str, char_limit: int, 
                                          reference_hint: dict, state: PipelineState) -> dict:
            """단일 문항 처리 (Semaphore로 동시 실행 수 제한)"""
            async with question_semaphore:
                logger.info(f"[PARALLEL] Starting Q{idx+1}: '{question[:30]}...' (limit: {char_limit})")
                
                # QuestionState 초기화
                q_state: QuestionState = {
                    "pipeline_state": state,
                    "question": question,
                    "char_limit": char_limit,
                    "reference_hint": reference_hint,
                    "relevant_blocks": [],
                    "relevant_block_indices": [],
                    "current_content": "",
                    "char_count": 0,
                    "attempt": 0,
                    "max_attempts": 1,
                    "final_content": "",
                    "check_result": "pass",
                    "char_diff": 0
                }
                
                # 하위 그래프 실행
                result = await self.question_graph.ainvoke(q_state)
                final_content = result.get("final_content", "")
                used_indices = result.get("relevant_block_indices", [])
                
                logger.info(f"[PARALLEL] Completed Q{idx+1}: {len(final_content)} chars")
                
                return {
                    "idx": idx,
                    "question": question,
                    "answer": final_content,
                    "length": len(final_content),
                    "used_indices": used_indices
                }
        
        async def run_all_questions_parallel(state: PipelineState):
            """모든 문항을 병렬로 처리"""
            questions = state["questions"]
            char_limits = state["char_limits"]
            reference_mapping = state.get("reference_mapping") or {}
            
            # 빈 문항 필터링
            valid_questions = []
            for i, q in enumerate(questions):
                if q and str(q).strip():
                    hint = reference_mapping.get(f"Q{i+1}", {})
                    valid_questions.append((i, q, char_limits[i], hint))
                else:
                    logger.warning(f"[PARALLEL] Skipping empty question at index {i}")
            
            if not valid_questions:
                return {"final_answers": [], "used_block_indices": []}
            
            logger.info(f"[PARALLEL] Processing {len(valid_questions)} questions in parallel (limit: {PARALLEL_LIMIT})")
            
            # 병렬 실행
            tasks = [
                process_single_question(idx, q, limit, hint, state)
                for idx, q, limit, hint in valid_questions
            ]
            results = await asyncio.gather(*tasks)
            
            # 결과 정렬 (원래 순서 유지)
            results_sorted = sorted(results, key=lambda x: x["idx"])
            
            # final_answers 구성
            final_answers = [
                {"question": r["question"], "answer": r["answer"], "length": r["length"]}
                for r in results_sorted
            ]
            
            # 사용된 블록 인덱스 병합
            all_used = set()
            for r in results_sorted:
                all_used.update(r["used_indices"])
            
            logger.info(f"[PARALLEL] All {len(results_sorted)} questions completed")
            
            return {
                "final_answers": final_answers,
                "used_block_indices": list(all_used),
                "current_question_idx": len(questions)  # 완료 표시
            }

        workflow.add_node("process_questions_parallel", run_all_questions_parallel)
        
        # 엣지 정의 (단순화: 전처리 → 병렬처리 → 종료)
        workflow.set_entry_point("preprocess_reference")
        workflow.add_edge("preprocess_reference", "process_questions_parallel")
        workflow.add_edge("process_questions_parallel", END)
        
        return workflow.compile()
