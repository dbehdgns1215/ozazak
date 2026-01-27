from typing import Dict, Any
from src.application.ports.llm_port import LLMPort
from src.application.dtos.requests import AnalyzeJobPostingRequestDTO
from src.domain.value_objects.job_analysis import JobAnalysis
from src.domain.exceptions import GenerationError, InvalidRequestError

class AnalyzeJobPostingUseCase:
    """Use Case for analyzing job postings"""
    
    def __init__(self, llm_adapter: LLMPort):
        self.llm_adapter = llm_adapter
        
    async def execute(self, request: AnalyzeJobPostingRequestDTO) -> JobAnalysis:
        if not request.job_posting:
            raise InvalidRequestError("Job posting content cannot be empty")
            
        try:
            analysis = await self.llm_adapter.analyze_job_posting(
                company_name=request.company_name,
                position=request.position,
                job_posting=request.job_posting,
                requirements=request.requirements
            )
            return analysis
            
        except Exception as e:
            raise GenerationError(f"Failed to analyze job posting: {str(e)}") from e
