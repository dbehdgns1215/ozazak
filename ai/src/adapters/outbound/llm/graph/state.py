from typing import List, Dict, Any, Optional, Set
from typing_extensions import TypedDict
from langchain_core.documents import Document

class PipelineState(TypedDict):
    """Overall pipeline state"""
    # Inputs
    questions: List[str]
    char_limits: List[int]
    blocks: List[str]
    reference_letter: Optional[str]
    job_posting: dict
    company_info: dict
    user_prompt: Optional[str]  # 사용자 추가 지시사항
    pre_fetched_rag: Optional[dict]  # 병렬로 미리 실행한 RAG 결과
    
    # Preprocessing
    block_documents: List[Document] # For FAISS
    reference_mapping: Dict[str, dict] # LLM mapping result
    
    # Tracking
    used_block_indices: List[int]
    current_question_idx: int
    
    # Outputs
    final_answers: List[dict] # [{question, answer, stats}]


class QuestionState(TypedDict):
    """Single question processing state"""
    # Context
    pipeline_state: PipelineState # Reference to parent (or pass specifics)
    question: str
    char_limit: int
    reference_hint: dict
    
    # RAG
    relevant_blocks: List[str]
    relevant_block_indices: List[int]
    
    # Generation & Refinement
    current_content: str
    char_count: int
    attempt: int
    max_attempts: int
    
    # Output
    final_content: str
    
    # Internal (Validation)
    check_result: str
    char_diff: int
