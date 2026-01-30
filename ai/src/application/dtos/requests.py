from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

@dataclass
class GenerateBlocksRequestDTO:
    source_type: str
    source_content: str
    model_type: Optional[str] = None

@dataclass
class AnalyzeJobPostingRequestDTO:
    company_name: str
    position: str
    job_posting: str
    requirements: str = ""
    model_type: Optional[str] = None

@dataclass
class SmartGenerationRequestDTO:
    question: str
    company_name: str
    position: str
    user_id: Optional[int] = None
    coverletter_id: Optional[int] = None
    question_id: Optional[int] = None
    blocks: Optional[List[Dict[str, Any]]] = None
    cover_letters: Optional[List[Dict[str, Any]]] = None
    job_analysis: Optional[Dict[str, Any]] = None
    poster_url: Optional[str] = None
    fallback_content: Optional[str] = None
    save_to_backend: bool = False
    auth_token: Optional[str] = None
    char_limit: Optional[int] = 800
    model_type: Optional[str] = None

@dataclass
class SelectedGenerationRequestDTO:
    question: str
    blocks: Optional[List[Any]] = None
    cover_letters: Optional[List[Any]] = None
    block_ids: Optional[List[int]] = None
    cover_letter_ids: Optional[List[int]] = None
    company_name: str = ""
    position: str = ""
    job_analysis: Optional[Dict[str, Any]] = None
    poster_url: Optional[str] = None
    fallback_content: Optional[str] = None
    char_limit: Optional[int] = 800
    save_to_backend: bool = False
    coverletter_id: Optional[int] = None
    question_id: Optional[int] = None
    auth_token: Optional[str] = None
    model_type: Optional[str] = None

@dataclass
class CoverLetterRefinementRequestDTO:
    question: str
    original_content: str
    feedback: str
    cover_letter_id: Optional[int] = None
    question_id: Optional[int] = None
    company_name: Optional[str] = None
    position: Optional[str] = None
    save_to_backend: bool = False
    auth_token: Optional[str] = None
    model_type: Optional[str] = None
    char_limit: Optional[int] = 800
