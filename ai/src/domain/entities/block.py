from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class Block:
    id: Optional[int] = None
    content: str = ""
    category: str = "UNKNOWN"
    keywords: List[str] = field(default_factory=list)
    
    def to_text(self) -> str:
        """Returns text representation for LLM prompt"""
        return self.content
