"""LLM 어댑터 팩토리 - 모델 타입에 따라 적절한 어댑터 반환"""
from typing import Optional
from enum import Enum

from .base_llm_adapter import BaseLLMAdapter
from src.config.settings import settings


class ModelType(str, Enum):
    """지원하는 AI 모델 타입"""
    GPT = "gpt"
    GEMINI = "gemini"
    GEMINI_FLASH = "gemini-flash"  # 기본값
    CLAUDE = "claude"


# 어댑터 인스턴스 캐시
_adapter_cache: dict = {}


def get_llm_adapter(model_type: Optional[str] = None) -> BaseLLMAdapter:
    """
    모델 타입에 따른 LLM 어댑터 반환
    
    Args:
        model_type: 모델 타입 (gpt, gemini, gemini-flash, claude)
                   None이면 기본값(gemini-flash) 사용
    
    Returns:
        해당 모델의 LLM 어댑터 인스턴스
    """
    # 기본값: gemini-flash
    if model_type is None:
        model_type = settings.default_model
    
    model_type = model_type.lower()
    
    # 캐시 확인
    if model_type in _adapter_cache:
        return _adapter_cache[model_type]
    
    # 어댑터 생성
    adapter = _create_adapter(model_type)
    _adapter_cache[model_type] = adapter
    
    return adapter


def _create_adapter(model_type: str) -> BaseLLMAdapter:
    """모델 타입에 따른 어댑터 생성"""
    
    if model_type == ModelType.GPT or model_type == "gpt":
        from .openai_adapter import OpenAILLMAdapter
        return OpenAILLMAdapter(model=settings.gpt_model)
    
    elif model_type == ModelType.GEMINI or model_type == "gemini":
        from .gemini_adapter import GeminiLLMAdapter
        return GeminiLLMAdapter(model=settings.gemini_pro_model)
    
    elif model_type == ModelType.GEMINI_FLASH or model_type == "gemini-flash":
        from .gemini_adapter import GeminiLLMAdapter
        return GeminiLLMAdapter(model=settings.gemini_flash_model)
    
    elif model_type == ModelType.CLAUDE or model_type == "claude":
        from .claude_adapter import ClaudeLLMAdapter
        return ClaudeLLMAdapter(model=settings.claude_model)
    
    else:
        # 알 수 없는 모델 타입 -> 기본값 사용
        from .gemini_adapter import GeminiLLMAdapter
        return GeminiLLMAdapter(model=settings.gemini_flash_model)


def clear_adapter_cache():
    """어댑터 캐시 초기화"""
    global _adapter_cache
    _adapter_cache = {}
