from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Search 결과
class CompanySearchResult(BaseModel):
    company_name: str
    industry: str
    description: str
    news: List[str]
    culture: str
    raw_results: Optional[List[Any]] = None

# Scraper 결과
class JobPostingData(BaseModel):
    title: str
    company: str
    description: str
    requirements: List[str]
    preferred: List[str]
    tasks: List[str]
    benefits: Optional[List[str]] = []

# Generation 결과
class CoverLetterOutput(BaseModel):
    content: str = Field(description="본문 (마크다운 없이)")
    selected_blocks: List[int]
    key_points: List[str]
    matched_requirements: List[str]

# Validation 결과
class ValidationResult(BaseModel):
    valid: bool
    char_count: int
    issues: List[str] = []
    suggestions: List[str] = []

# 최종 출력
class FinalOutput(BaseModel):
    content: str  # 정제된 최종 자소서
    validation: ValidationResult
    metadata: Dict  # company_info, job_posting, selected_blocks
