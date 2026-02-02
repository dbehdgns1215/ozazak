import pytest
from src.adapters.outbound.tools.validator import CharacterCountValidator

class TestCharacterCountValidator:
    def setup_method(self):
        # Default ratios: 0.8 (80%) ~ 1.2 (120%)
        self.validator = CharacterCountValidator(min_ratio=0.8, max_ratio=1.2)

    def test_validate_valid_text(self):
        """1. 정상 범위 텍스트 (90자, 제한 100자 -> 90% -> OK)"""
        char_limit = 100
        text = "글" * 90 
        result = self.validator.run(text, char_limit=char_limit)
        
        assert result["valid"] is True
        assert result["status"] == "OK"
        assert "적정" in result["message"]

    def test_validate_too_short(self):
        """2. 글자 수 부족 (50자, 제한 100자 -> 50% -> TOO_SHORT)"""
        char_limit = 100
        text = "글" * 50
        result = self.validator.run(text, char_limit=char_limit)
        
        assert result["valid"] is False
        assert result["status"] == "TOO_SHORT"
        assert "부족" in result["message"]
        assert result["diff"] == 80 - 50 # min 80 (0.8 * 100)

    def test_validate_too_long(self):
        """3. 글자 수 초과 (130자, 제한 100자 -> 130% -> TOO_LONG)"""
        char_limit = 100
        text = "글" * 130
        result = self.validator.run(text, char_limit=char_limit)
        
        assert result["valid"] is False
        assert result["status"] == "TOO_LONG"
        assert "초과" in result["message"]
        assert result["diff"] == 130 - 120 # max 120 (1.2 * 100)

    def test_validate_whitespace_handling(self):
        """4. 공백/개행 제외 계산 검증"""
        char_limit = 10
        # "가 나" -> 공백 제외 2자
        text = "가 나" * 4  # "가 나가 나가 나가 나" (8 chars excl space? No. "가 나" is 2 non-space chars. Total 8 chars.)
        # Wait "가 나" len 3. Replace space -> "가나" len 2.
        # "가 나" * 4 = "가 나가 나가 나가 나" -> 12 chars.
        # replace space -> "가나가나가나가나" -> 8 chars.
        
        # Min ratio 0.8 -> min 8 chars.
        result = self.validator.run(text, char_limit=char_limit)
        assert result["valid"] is True
        assert result["char_count"] == 8

    def test_validate_zero_limit(self):
        """5. char_limit=0 엣지 케이스 -> 0 division check"""
        # If limit is 0, logic says ratio = 0 if limit > 0 else 0
        # min_chars = int(0 * 0.8) = 0
        # max_chars = int(0 * 1.2) = 0
        # text "abc" -> count 3.
        # 3 > 0 -> TOO_LONG?
        
        validator = CharacterCountValidator()
        result = validator.run("abc", char_limit=0)
        
        # With limit 0, everything > 0 is TOO_LONG if max_chars is 0.
        assert result["char_limit"] == 0
        assert result["max_chars"] == 0
        assert result["status"] == "TOO_LONG"
        assert result["valid"] is False
        
    def test_validate_empty_string(self):
        """6. 빈 문자열 입력"""
        char_limit = 100
        text = ""
        result = self.validator.run(text, char_limit=char_limit)
        
        assert result["valid"] is False
        assert result["status"] == "TOO_SHORT"
        assert result["char_count"] == 0
