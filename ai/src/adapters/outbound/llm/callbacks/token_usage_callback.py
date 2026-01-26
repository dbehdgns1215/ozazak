"""LangChain Token Usage Callback Handler"""
import logging
from typing import Dict, Any, List
from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.outputs import LLMResult

logger = logging.getLogger(__name__)


class TokenUsageCallbackHandler(BaseCallbackHandler):
    """토큰 사용량 추적 및 로깅을 위한 Callback Handler"""
    
    def __init__(self, token_limit: int = 5000):
        self.token_limit = token_limit
        self.total_tokens = 0
        self.prompt_tokens = 0
        self.completion_tokens = 0
        
    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        """LLM 호출이 끝났을 때 토큰 사용량 집계"""
        if response.llm_output and "token_usage" in response.llm_output:
            usage = response.llm_output["token_usage"]
            
            p_tokens = usage.get("prompt_tokens", 0)
            c_tokens = usage.get("completion_tokens", 0)
            t_tokens = usage.get("total_tokens", 0)
            
            self.prompt_tokens += p_tokens
            self.completion_tokens += c_tokens
            self.total_tokens += t_tokens
            
            logger.info(f"💰 Token Usage: {t_tokens} (Prompt: {p_tokens}, Completion: {c_tokens})")
            
            if self.total_tokens > self.token_limit:
                logger.warning(
                    f"⚠️ Token limit exceeded! Total: {self.total_tokens} > Limit: {self.token_limit}"
                )
    
    def check_limit(self) -> bool:
        """누적 토큰량이 제한을 초과했는지 확인"""
        if self.total_tokens > self.token_limit:
            return False
        return True
