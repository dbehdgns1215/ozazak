"""API Request/Response 스키마 (고도화 버전)"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class SourceType(str, Enum):
    PROJECT = "project"
    COVER_LETTER = "cover_letter"


class BlockGenerationRequest(BaseModel):
    user_id: str = Field(..., description="사용자 ID")
    source_type: SourceType = Field(..., description="소스 타입")
    source_content: str = Field(..., description="소스 내용")


class BlockData(BaseModel):
    category: str = Field(..., description="블록 카테고리")
    content: str = Field(..., description="블록 내용")
    keywords: List[str] = Field(..., description="키워드")


class BlockGenerationResponse(BaseModel):
    success: bool = Field(..., description="성공 여부")
    blocks: List[BlockData] = Field(..., description="생성된 블록 리스트")
    message: Optional[str] = Field(None, description="메시지")


class JobPostingAnalysisRequest(BaseModel):
    user_id: str = Field(..., description="사용자 ID")
    company_name: str = Field(..., description="기업명")
    position: str = Field(..., description="직무명")
    job_posting: str = Field(..., description="채용공고 내용")
    requirements: Optional[str] = Field(None, description="추가 우대사항")


class JobPostingAnalysisResponse(BaseModel):
    success: bool = Field(..., description="성공 여부")
    analysis: Dict[str, Any] = Field(..., description="분석 결과")
    message: Optional[str] = Field(None, description="메시지")


class CoverLetterGenerationRequest(BaseModel):
    user_id: str = Field(..., description="사용자 ID")
    question: str = Field(..., description="자기소개서 문항")
    blocks: List[str] = Field(..., description="활용할 블록 내용")
    references: Optional[List[str]] = Field(None, description="참고 자기소개서")
    job_analysis: Optional[Dict[str, Any]] = Field(None, description="채용공고 분석 결과")
    char_limit: Optional[int] = Field(None, description="글자수 제한")
    company_name: Optional[str] = Field(None, description="기업명")
    position: Optional[str] = Field(None, description="직무명")


class CoverLetterGenerationResponse(BaseModel):
    success: bool = Field(..., description="성공 여부")
    content: str = Field(..., description="생성된 자기소개서")
    message: Optional[str] = Field(None, description="메시지")


class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="서비스 상태")
    version: str = Field(..., description="버전")
