import re
import logging
from ..schemas import ValidationResult

logger = logging.getLogger(__name__)

class ValidationChain:
    """
    자기소개서 검증 체인 (Python 로직 기반)
    LLM 호출 없이 글자수 및 기본 규칙 검증을 통해 속도 향상 및 비용 절감
    """
    
    def __init__(self, llm=None):
        # 인터페이스 호환성을 위해 llm 인자를 받지만 실제로는 사용하지 않음
        pass
        
    async def validate(self, content: str, char_limit: int) -> ValidationResult:
        try:
            logger.info("Validating content...")
            
            char_count = len(content)
            # 10% 오차 허용 (상한선만 체크, 하한선은 경고)
            max_limit = int(char_limit * 1.1)
            min_limit = int(char_limit * 0.8)
            
            issues = []
            suggestions = []
            
            # 1. 글자수 검증
            if char_count > max_limit:
                diff = char_count - char_limit
                issues.append(f"글자수 초과 ({char_count}/{char_limit}자)")
                suggestions.append(f"약 {diff}자를 줄여주세요.")
            elif char_count < min_limit:
                diff = char_limit - char_count
                issues.append(f"글자수 부족 ({char_count}/{char_limit}자)")
                suggestions.append(f"약 {diff}자를 더 작성해주세요.")
            
            # 2. 마크다운 문법 검증
            # 제목(#), 볼드(**), 이탤릭(*), 코드블록(`) 등 체크
            markdown_patterns = [
                (r'^#\s', "제목(Heading) 서식(#)이 포함됨"),
                (r'\*\*.+?\*\*', "볼드체(**)가 포함됨"),
                (r'`.+?`', "코드 블록(`)이 포함됨")
            ]
            
            found_markdown = False
            for pattern, msg in markdown_patterns:
                if re.search(pattern, content, re.MULTILINE):
                    if not found_markdown:
                        issues.append("마크다운 서식이 포함되어 있습니다.")
                        suggestions.append("순수 텍스트로만 작성해주세요 (특수문자 제거).")
                        found_markdown = True
            
            # 3. 필수 포함 여부 (간단한 키워드 체크)
            # 질문에 대한 답변인지는 내용 분석이 필요하므로 Python으로는 한계가 있음
            # 다만, 너무 짧은 문단이나 반복적인 패턴 등을 체크할 수는 있음 (여기서는 생략)
            
            # 최종 판정
            # 글자수가 허용 범위 내이고 마크다운이 없으면 Valid
            is_length_valid = char_count <= max_limit
            valid = is_length_valid and not found_markdown
            
            return ValidationResult(
                valid=valid,
                char_count=char_count,
                issues=issues,
                suggestions=suggestions
            )
            
        except Exception as e:
            logger.error(f"Validation Error: {e}")
            return ValidationResult(
                valid=True, # 에러 발생 시 일단 통과시킴
                char_count=len(content),
                issues=["검증 시스템 오류"],
                suggestions=[]
            )
