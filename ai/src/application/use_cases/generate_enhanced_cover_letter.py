from typing import Any
from ...application.dtos.requests import EnhancedCoverLetterRequestDTO
from ...adapters.outbound.llm.base_llm_adapter import BaseLLMAdapter

class GenerateEnhancedCoverLetterUseCase:
    """Enhanced Cover Letter Generation Use Case"""
    
    def __init__(self, llm_adapter: BaseLLMAdapter):
        self.llm_adapter = llm_adapter
        
    async def execute(self, request_dto: EnhancedCoverLetterRequestDTO) -> Any:
        """
        Execute the use case
        Returns: FinalOutput (Pydantic model from chains/schemas)
        """
        # Adapter의 enhanced method 호출
        # Note: BaseLLMAdapter에는 정의되어 있지 않을 수 있으므로 타입 체킹이나 추상 메서드 추가가 필요할 수 있음.
        # 여기서는 덕 타이핑으로 호출.
        
        if not hasattr(self.llm_adapter, "generate_enhanced_cover_letter"):
            raise NotImplementedError("This LLM adapter does not support enhanced generation pipeline.")
            
        return await self.llm_adapter.generate_enhanced_cover_letter(
            question=request_dto.question,
            blocks=request_dto.blocks,
            company_name=request_dto.company_name,
            position=request_dto.position,
            poster_url=request_dto.poster_url,
            fallback_content=request_dto.fallback_content,
            char_limit=request_dto.char_limit
        )
