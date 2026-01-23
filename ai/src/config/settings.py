"""환경 설정 관리 (멀티 모델 지원)"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """애플리케이션 설정"""
    
    # GMS API Key (공용)
    gms_api_key: str
    
    # 기본 모델 설정 (gemini-flash가 기본값)
    default_model: str = "gemini-flash"
    
    # GPT 모델 설정
    gpt_model: str = "gpt-5.1"
    
    # Gemini 모델 설정
    gemini_pro_model: str = "gemini-2.5-pro"
    gemini_flash_model: str = "gemini-2.5-flash-lite"
    gemini_model: str = "gemini-2.5-flash-lite"  # 기본 gemini 모델
    
    # Claude 모델 설정
    claude_model: str = "claude-sonnet-4-5-20250929"
    
    # LLM 공통 설정
    llm_temperature: float = 0.7
    
    # Backend API 설정
    backend_api_base_url: str = "http://localhost:8080"
    backend_api_timeout: int = 30
    
    # FastAPI 설정
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_env: str = "development"
    
    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
