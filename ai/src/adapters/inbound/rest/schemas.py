"""API Request/Response 스키마"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class SourceType(str, Enum):
    """블록 생성 소스 타입"""
    PROJECT = "project"
    COVER_LETTER = "cover_letter"


class BlockGenerationRequest(BaseModel):
    """블록 생성 요청"""
    user_id: str = Field(..., description="사용자 ID")
    source_type: SourceType = Field(..., description="소스 타입")
    source_content: str = Field(..., description="소스 내용 (프로젝트 정보나 자기소개서)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "source_type": "project",
                "source_content": "프로젝트명: AI 자기소개서 작성 도구\n기술 스택: Python, FastAPI, LangChain, OpenAI GPT-4\n역할: 백엔드 개발 및 LangChain 통합\n성과: 자기소개서 생성 시간 80% 단축"
            }
        }


class BlockData(BaseModel):
    """블록 데이터"""
    category: str = Field(..., description="블록 카테고리")
    content: str = Field(..., description="블록 내용")
    keywords: List[str] = Field(..., description="키워드")


class BlockGenerationResponse(BaseModel):
    """블록 생성 응답"""
    success: bool = Field(..., description="성공 여부")
    blocks: List[BlockData] = Field(..., description="생성된 블록 리스트")
    message: Optional[str] = Field(None, description="메시지")


class CoverLetterGenerationRequest(BaseModel):
    """자기소개서 생성 요청"""
    user_id: str = Field(..., description="사용자 ID")
    question: str = Field(..., description="자기소개서 문항")
    blocks: List[str] = Field(..., description="활용할 블록 내용")
    references: Optional[List[str]] = Field(None, description="참고 자기소개서")
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "question": "지원 동기와 입사 후 포부를 작성해주세요.",
                "blocks": [
                    "Python과 FastAPI를 활용하여 RESTful API 개발 경험이 있습니다.",
                    "팀 프로젝트에서 LangChain을 도입하여 AI 기능을 성공적으로 구현했습니다."
                ],
                "references": [
                    "저는 항상 새로운 기술을 학습하고 적용하는 것을 즐깁니다..."
                ]
            }
        }


class CoverLetterGenerationResponse(BaseModel):
    """자기소개서 생성 응답"""
    success: bool = Field(..., description="성공 여부")
    content: str = Field(..., description="생성된 자기소개서")
    message: Optional[str] = Field(None, description="메시지")


class HealthCheckResponse(BaseModel):
    """Health Check 응답"""
    status: str = Field(..., description="서비스 상태")
    version: str = Field(..., description="버전")
