from dataclasses import dataclass
from typing import Optional

@dataclass
class CoverLetter:
    id: Optional[int] = None
    question: str = ""
    content: str = ""
    company: Optional[str] = None
    
    def to_text(self) -> str:
        """Returns text representation for LLM prompt"""
        return f"Q: {self.question}\nA: {self.content}"
