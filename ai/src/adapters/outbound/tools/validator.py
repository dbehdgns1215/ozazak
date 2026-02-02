"""글자 수 검증 Tool"""
from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class CharacterCountValidator:
    """글자 수 검증 Tool
    
    생성된 자기소개서의 글자 수가 제한 범위 내인지 검증합니다.
    """
    
    name = "character_count_validator"
    description = "생성된 자기소개서의 글자 수가 제한 범위 내인지 검증합니다."
    
    # 허용 범위 비율 (기본값)
    DEFAULT_MIN_RATIO = 0.8   # 최소 90% (-10%)
    DEFAULT_MAX_RATIO = 1.2  # 최대 105% (+5%)
    
    def __init__(self, min_ratio: float = None, max_ratio: float = None):
        self.min_ratio = min_ratio or self.DEFAULT_MIN_RATIO
        self.max_ratio = max_ratio or self.DEFAULT_MAX_RATIO
    
    def run(
        self,
        content: str,
        char_limit: int,
        min_ratio: float = None,
        max_ratio: float = None
    ) -> Dict:
        """
        글자 수 검증 실행
        
        Args:
            content: 검증할 텍스트
            char_limit: 글자 수 제한
            min_ratio: 최소 비율 (기본 0.9 = 90%)
            max_ratio: 최대 비율 (기본 1.05 = 105%)
            
        Returns:
            {
                "valid": bool,
                "char_count": int,
                "char_limit": int,
                "ratio": float,
                "status": "OK" | "TOO_SHORT" | "TOO_LONG",
                "message": str
            }
        """
        min_r = min_ratio or self.min_ratio
        max_r = max_ratio or self.max_ratio
        
        # 공백 제외 글자 수 계산
        char_count = len(content.replace(" ", "").replace("\n", ""))
        
        # 비율 계산
        ratio = char_count / char_limit if char_limit > 0 else 0
        
        # 유효 범위 계산
        min_chars = int(char_limit * min_r)
        max_chars = int(char_limit * max_r)
        
        # 상태 판정
        if char_count < min_chars:
            status = "TOO_SHORT"
            valid = False
            diff = min_chars - char_count
            action = "추가"
            message = (
                f"글자 수 부족: 현재 {char_count}자 (최소 {min_chars}자 필요). "
                f"부족한 {diff}자를 더 **추가**하여 내용을 보강해주세요."
            )
        elif char_count > max_chars:
            status = "TOO_LONG"
            valid = False
            diff = char_count - max_chars
            action = "삭제"
            message = (
                f"글자 수 초과: 현재 {char_count}자 (최대 {max_chars}자 허용). "
                f"초과된 {diff}자를 **삭제**하여 내용을 요약해주세요."
            )
        else:
            status = "OK"
            valid = True
            diff = 0
            action = "유지"
            message = f"적정 글자 수입니다: {char_count}자 (목표 범위: {min_chars}~{max_chars}자)"
        
        return {
            "valid": valid,
            "char_count": char_count,
            "char_limit": char_limit,
            "ratio": round(ratio, 2),
            "status": status,
            "message": message,
            "min_chars": min_chars,
            "max_chars": max_chars,
            "diff": diff,
            "action": action
        }
    
    def validate_batch(
        self,
        contents: list,
        char_limits: list
    ) -> Dict:
        """
        여러 자기소개서 일괄 검증
        
        Returns:
            {
                "results": [각 검증 결과],
                "summary": {
                    "total": int,
                    "valid": int,
                    "too_short": int,
                    "too_long": int
                }
            }
        """
        results = []
        summary = {"total": 0, "valid": 0, "too_short": 0, "too_long": 0}
        
        for content, limit in zip(contents, char_limits):
            result = self.run(content, limit)
            results.append(result)
            summary["total"] += 1
            
            if result["status"] == "OK":
                summary["valid"] += 1
            elif result["status"] == "TOO_SHORT":
                summary["too_short"] += 1
            else:
                summary["too_long"] += 1
        
        return {
            "results": results,
            "summary": summary
        }
    
    @staticmethod
    def count_chars(text: str, exclude_spaces: bool = True) -> int:
        """글자 수 계산 유틸리티"""
        if exclude_spaces:
            return len(text.replace(" ", "").replace("\n", ""))
        return len(text)
    
    @staticmethod
    def format_report(validation_result: Dict) -> str:
        """검증 결과를 보기 좋은 문자열로 포맷팅"""
        r = validation_result
        icon = "✅" if r["valid"] else ("⚠️" if r["status"] == "TOO_SHORT" else "❌")
        
        return (
            f"{icon} {r['message']}\n"
            f"   현재: {r['char_count']}자 / 제한: {r['char_limit']}자\n"
            f"   허용 범위: {r['min_chars']}~{r['max_chars']}자"
        )
