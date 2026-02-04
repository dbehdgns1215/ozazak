from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class Block:
    id: Optional[int] = None
    content: str = ""
    category: str = "기타"  # 매핑되지 않은 경우 기본값
    keywords: List[str] = field(default_factory=list)
    embedding: Optional[List[float]] = None  # 임베딩 벡터
    
    def to_text(self) -> str:
        """Returns text representation for LLM prompt"""
        return self.content

