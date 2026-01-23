"""환경 설정 관리"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """애플리케이션 설정"""
    
    # OpenAI 설정 (SSAFY GMS)
    openai_api_key: str
    openai_base_url: str = "https://gms.ssafy.io/gmsapi/api.openai.com/v1"
    openai_model: str = "gpt-4o"
    openai_temperature: float = 0.7
    
    # Backend API 설정
    backend_api_base_url: str
    backend_api_timeout: int = 30
    
    # FastAPI 설정
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_env: str = "development"
    
    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """CORS origin 리스트 반환"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# 싱글톤 설정 인스턴스
settings = Settings()
