from dataclasses import dataclass, field
from typing import List, Optional

@dataclass(frozen=True)
class JobAnalysis:
    """Value Object representing job posting analysis result"""
    responsibilities: List[str] = field(default_factory=list)
    requirements: List[str] = field(default_factory=list)
    preferred_qualifications: List[str] = field(default_factory=list)
    ideal_candidate: str = ""
    yearly_goals: str = ""
    company_name: Optional[str] = None
    position: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict, company_name: str = "", position: str = "") -> "JobAnalysis":
        """Create JobAnalysis from dictionary"""
        if not data:
            return cls(company_name=company_name, position=position)
            
        return cls(
            responsibilities=data.get("key_responsibilities", []) or data.get("responsibilities", []),
            requirements=data.get("requirements", []),
            preferred_qualifications=data.get("core_competencies", []) or data.get("preferred_qualifications", []),
            ideal_candidate=data.get("ideal_candidate", ""),
            yearly_goals=data.get("keywords", "") or data.get("yearly_goals", ""),
            company_name=company_name,
            position=position
        )

    def to_prompt_text(self) -> str:
        """Converts analysis to text format for LLM prompt"""
        return f"""
[직무 분석]
- 주요 업무: {', '.join(self.responsibilities)}
- 자격 요건: {', '.join(self.requirements)}
- 우대 사항: {', '.join(self.preferred_qualifications)}
- 인재상: {self.ideal_candidate}
- 목표: {self.yearly_goals}
"""
