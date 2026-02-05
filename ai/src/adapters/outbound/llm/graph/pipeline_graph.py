import logging
from typing import List
from langgraph.graph import StateGraph, END
from langchain_core.language_models import BaseChatModel

from .state import PipelineState, QuestionState
from .nodes.reference_mapper import ReferenceMapperNode
from .question_graph import create_question_graph

logger = logging.getLogger(__name__)

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
        
        # 2. 문항 루프 노드
        async def run_question_loop(state: PipelineState):
            idx = state.get("current_question_idx", 0)
            questions = state["questions"]
            
            if idx >= len(questions):
                return {"current_question_idx": idx} # END Condition
            
            current_q = questions[idx]
            
            # 빈 질문 방어 로직
            if not current_q or not str(current_q).strip():
                logger.warning(f"[DEBUG] Skipping empty question at index {idx}")
                return {
                    "current_question_idx": idx + 1,
                    "final_answers": state.get("final_answers", [])
                }
            current_limit = state["char_limits"][idx]

            # === DEBUG LOGGING ===
            logger.info(f"[DEBUG] pipeline_graph: idx={idx}, current_q='{current_q[:30]}...', current_limit={current_limit}")
            logger.info(f"[DEBUG] pipeline_graph: blocks count={len(state.get('blocks', []))}")
            reference_mapping = state.get("reference_mapping", {})
            q_hint = reference_mapping.get(f"Q{idx+1}", {})
            
            # QuestionState 초기화
            q_state: QuestionState = {
                "pipeline_state": state,
                "question": current_q,
                "char_limit": current_limit,
                "reference_hint": q_hint,
                "relevant_blocks": [],
                "relevant_block_indices": [],
                "current_content": "",
                "char_count": 0,
                "attempt": 0,
                "max_attempts": 3,
                "final_content": ""
            }
            
            # 하위 그래프 실행
            logger.info("[DEBUG] pipeline_graph: Invoking question_graph...")
            result = await self.question_graph.ainvoke(q_state)
            logger.info(f"[DEBUG] pipeline_graph: question_graph returned, result keys={list(result.keys())}")

            # 결과 업데이트
            final_content = result.get("final_content", "")
            logger.info(f"[DEBUG] pipeline_graph: final_content length={len(final_content)}")
            used_indices = set(result.get("relevant_block_indices", []))
            
            # 사용된 블록 인덱스 누적 (List -> Set -> Update -> List)
            all_used = set(state.get("used_block_indices", []))
            all_used.update(used_indices)
            all_used_list = list(all_used)
            
            new_answer = {
                "question": current_q,
                "answer": final_content,
                "length": len(final_content)
            }
            
            answers = state.get("final_answers", [])
            answers.append(new_answer)
            
            return {
                "used_block_indices": all_used_list,
                "current_question_idx": idx + 1,
                "final_answers": answers
            }

        workflow.add_node("process_question", run_question_loop)
        
        # 엣지 정의
        workflow.set_entry_point("preprocess_reference")
        workflow.add_edge("preprocess_reference", "process_question")
        
        # Loop 조건
        def loop_condition(state: PipelineState):
            if state["current_question_idx"] < len(state["questions"]):
                return "continue"
            return "end"
            
        workflow.add_conditional_edges(
            "process_question",
            loop_condition,
            {
                "continue": "process_question",
                "end": END
            }
        )
        
        return workflow.compile()
