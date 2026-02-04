from typing import List
from src.application.ports.llm_port import LLMPort
from src.application.dtos.requests import GenerateBlocksRequestDTO
from src.domain.entities.block import Block
from src.domain.exceptions import GenerationError, InvalidRequestError
from langchain_openai import OpenAIEmbeddings
from src.config.settings import settings

class GenerateBlocksUseCase:
    """Use Case for generating blocks from project or cover letter"""
    
    def __init__(self, llm_adapter: LLMPort):
        self.llm_adapter = llm_adapter
        # Initialize OpenAI Embeddings with text-embedding-3-large, 1536 dimensions
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-large",
            dimensions=1536,
            openai_api_key=settings.gms_api_key,
            base_url="https://gms.ssafy.io/gmsapi/api.openai.com/v1"
        )
        
    async def execute(self, request: GenerateBlocksRequestDTO) -> List[Block]:
        if not request.source_content:
            raise InvalidRequestError("Source content cannot be empty")
            
        try:
            # 1. Generate blocks using LLM
            if request.source_type == "project":
                blocks = await self.llm_adapter.extract_blocks_from_project(request.source_content)
            else:
                blocks = await self.llm_adapter.extract_blocks_from_cover_letter(
                    question="자기소개서", essay=request.source_content
                )
            
            # 2. Generate embeddings for each block
            for block in blocks:
                # Combine category and content for better semantic representation
                text_to_embed = f"{block.category} {block.content}"
                embedding_vector = await self.embeddings.aembed_query(text_to_embed)
                block.embedding = embedding_vector
            
            return blocks
            
        except Exception as e:
            raise GenerationError(f"Failed to generate blocks: {str(e)}") from e
