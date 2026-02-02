from typing import List
from src.application.ports.llm_port import LLMPort
from src.application.dtos.requests import GenerateBlocksRequestDTO
from src.domain.entities.block import Block
from src.domain.exceptions import GenerationError, InvalidRequestError

class GenerateBlocksUseCase:
    """Use Case for generating blocks from project or cover letter"""
    
    def __init__(self, llm_adapter: LLMPort):
        self.llm_adapter = llm_adapter
        
    async def execute(self, request: GenerateBlocksRequestDTO) -> List[Block]:
        if not request.source_content:
            raise InvalidRequestError("Source content cannot be empty")
            
        try:
            if request.source_type == "project":
                blocks = await self.llm_adapter.extract_blocks_from_project(request.source_content)
            else:
                blocks = await self.llm_adapter.extract_blocks_from_cover_letter(
                    question="자기소개서", essay=request.source_content
                )
            
            # Already List[Block]
            return blocks
            
        except Exception as e:
            raise GenerationError(f"Failed to generate blocks: {str(e)}") from e
