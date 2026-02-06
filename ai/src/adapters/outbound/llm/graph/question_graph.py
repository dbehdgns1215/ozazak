from langgraph.graph import StateGraph, END
from langchain_core.language_models import BaseChatModel

from .state import QuestionState
from .nodes.block_retriever import BlockRetrieverNode
from .nodes.generator import GeneratorNode
from .nodes.length_checker import LengthCheckerNode
from .nodes.enhancer import EnhancerNode
from .nodes.format_fixer import FormatFixerNode

def create_question_graph(llm: BaseChatModel, openai_api_key: str):
    """단일 문항 생성 그래프 생성"""
    
    # 노드 초기화
    retriever = BlockRetrieverNode(openai_api_key)
    generator = GeneratorNode(llm)
    checker = LengthCheckerNode()
    enhancer = EnhancerNode(llm)
    fixer = FormatFixerNode()
    
    # 그래프 정의
    workflow = StateGraph(QuestionState)
    
    # 노드 추가
    workflow.add_node("retrieve_blocks", retriever)
    workflow.add_node("generate_draft", generator)
    workflow.add_node("check_length", checker)
    workflow.add_node("enhance_content", enhancer)
    workflow.add_node("fix_format", fixer)
    
    # 엣지 정의
    workflow.set_entry_point("retrieve_blocks")
    workflow.add_edge("retrieve_blocks", "generate_draft")
    workflow.add_edge("generate_draft", "check_length")
    
    # 조건부 엣지: check_length -> (pass) -> fix_format / (fail) -> enhance_content
    def check_length_condition(state: QuestionState):
        if state.get("check_result") == "pass":
            return "pass"
        
        # 최대 시도 횟수 초과 시 강제 통과
        if state.get("attempt", 0) >= state.get("max_attempts", 3):
            return "pass"
            
        return "refine"

    workflow.add_conditional_edges(
        "check_length",
        check_length_condition,
        {
            "pass": "fix_format",
            "refine": "enhance_content"
        }
    )
    
    workflow.add_edge("enhance_content", "check_length") # 루프
    workflow.add_edge("fix_format", END)
    
    return workflow.compile()
