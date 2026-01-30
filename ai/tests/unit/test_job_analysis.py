import pytest
from dataclasses import FrozenInstanceError
from src.domain.value_objects.job_analysis import JobAnalysis

class TestJobAnalysis:
    def test_from_dict_valid(self):
        """1. from_dict() 정상 변환"""
        data = {
            "responsibilities": ["Coding", "Testing"],
            "requirements": ["Python", "Git"],
            "preferred_qualifications": ["Docker"],
            "ideal_candidate": "Proactive",
            "yearly_goals": "Growth"
        }
        ja = JobAnalysis.from_dict(data, company_name="TestCo", position="Dev")
        
        assert ja.responsibilities == ["Coding", "Testing"]
        assert ja.requirements == ["Python", "Git"]
        assert ja.preferred_qualifications == ["Docker"]
        assert ja.ideal_candidate == "Proactive"
        assert ja.yearly_goals == "Growth"
        assert ja.company_name == "TestCo"
        assert ja.position == "Dev"

    def test_from_dict_key_compatibility(self):
        """2 & 3. Key compatibility (key_responsibilities, core_competencies, keywords)"""
        data = {
            "key_responsibilities": ["Leading"],  # Alias for responsibilities
            "core_competencies": ["Leadership"],  # Alias for preferred_qualifications
            "keywords": "KPI Achievement",        # Alias for yearly_goals
            "requirements": ["Communication"]
        }
        ja = JobAnalysis.from_dict(data)
        
        assert ja.responsibilities == ["Leading"]
        assert ja.preferred_qualifications == ["Leadership"]
        assert ja.yearly_goals == "KPI Achievement"
        assert ja.requirements == ["Communication"]

    def test_from_dict_empty(self):
        """4. from_dict() - 빈 dict → 기본값"""
        ja = JobAnalysis.from_dict({})
        
        assert ja.responsibilities == []
        assert ja.requirements == []
        assert ja.company_name == ""  # Default empty string based on method signature?
        # Method sig: def from_dict(cls, data: dict, company_name: str = "", position: str = "")
        assert ja.position == ""

    def test_from_dict_none_data(self):
        """5. from_dict() - None 입력 (Method expects dict, but let's see implementation handle check)"""
        # Implementation has `if not data: return cls(...)`
        ja = JobAnalysis.from_dict(None)
        assert ja.responsibilities == []

    def test_frozen_attributes(self):
        """6. frozen=True → 수정 시도 시 에러"""
        ja = JobAnalysis(responsibilities=["A"])
        with pytest.raises(FrozenInstanceError):
            ja.responsibilities = ["B"]
