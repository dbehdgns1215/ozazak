from typing import List, Tuple
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

from ..state import QuestionState
import logging

logger = logging.getLogger(__name__)

class BlockRetrieverNode:
    """FAISS 기반 경험 블록 검색 노드 (사용된 블록 제외)"""
    
    def __init__(self, openai_api_key: str):
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=openai_api_key,
            model="text-embedding-3-small",
            base_url="https://gms.ssafy.io/gmsapi/api.openai.com/v1"
        )
        
    async def __call__(self, state: QuestionState) -> dict:
        pipeline_state = state["pipeline_state"]
        all_blocks = pipeline_state.get("blocks", [])
        # List로 전달되므로 Set으로 변환하여 검색 효율화
        used_indices = set(pipeline_state.get("used_block_indices", []))

        # === DEBUG LOGGING ===
        logger.info(f"[DEBUG] BlockRetrieverNode: all_blocks count={len(all_blocks)}, used_indices={used_indices}")
        if all_blocks:
            logger.info(f"[DEBUG] BlockRetrieverNode: first block preview='{str(all_blocks[0])[:50]}...'")

        # 사용 가능한 블록 필터링 (인덱스 유지)
        available_blocks: List[Tuple[int, str]] = [
            (i, b) for i, b in enumerate(all_blocks)
            if i not in used_indices
        ]

        # 블록이 없으면 빈 리스트 반환
        if not available_blocks:
            logger.info("[DEBUG] No available blocks found (all used or empty)")
            return {
                "relevant_blocks": [],
                "relevant_block_indices": []
            }
            
        # 벡터 스토어 생성 (매번 생성하지만 블록 수가 적어서 빠름)
        # 메타데이터에 원래 인덱스 저장
        docs = [
            Document(page_content=b, metadata={"original_index": i}) 
            for i, b in available_blocks
        ]
        
        vectorstore = FAISS.from_documents(docs, self.embeddings)
        
        # 검색 쿼리 구성: 문항 + 직무 역량 키워드(있다면)
        query = f"{state['question']}"
        
        # 상위 2개 검색
        k = min(2, len(docs))
        results = vectorstore.similarity_search(query, k=k)
        
        found_blocks = [doc.page_content for doc in results]
        found_indices = [doc.metadata["original_index"] for doc in results]
        
        return {
            "relevant_blocks": found_blocks,
            "relevant_block_indices": found_indices
        }
