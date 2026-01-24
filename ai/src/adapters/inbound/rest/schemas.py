"""API Request/Response 스키마 (멀티 모델 지원)"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class SourceType(str, Enum):
    PROJECT = "project"
    COVER_LETTER = "cover_letter"


class ModelType(str, Enum):
    """지원 AI 모델 타입"""
    GPT = "gpt"
    GEMINI = "gemini"
    GEMINI_FLASH = "gemini-flash"
    CLAUDE = "claude"


class BlockGenerationRequest(BaseModel):
    user_id: str = Field(..., description="사용자 ID")
    source_type: SourceType = Field(..., description="소스 타입")
    source_content: str = Field(..., description="소스 내용")
    model_type: Optional[str] = Field(None, description="AI 모델 (gpt, gemini, gemini-flash, claude)")


class BlockData(BaseModel):
    category: str = Field(..., description="블록 카테고리")
    content: str = Field(..., description="블록 내용")
    keywords: List[str] = Field(..., description="키워드")


class BlockGenerationResponse(BaseModel):
    success: bool = Field(..., description="성공 여부")
    blocks: List[BlockData] = Field(..., description="생성된 블록 리스트")
    message: Optional[str] = Field(None, description="메시지")
    model_used: Optional[str] = Field(None, description="사용된 모델")


class JobPostingAnalysisRequest(BaseModel):
    user_id: str = Field(..., description="사용자 ID")
    company_name: str = Field(..., description="기업명")
    position: str = Field(..., description="직무명")
    job_posting: str = Field(..., description="채용공고 내용")
    requirements: Optional[str] = Field(None, description="추가 우대사항")
    model_type: Optional[str] = Field(None, description="AI 모델 (gpt, gemini, gemini-flash, claude)")


class JobPostingAnalysisResponse(BaseModel):
    success: bool = Field(..., description="성공 여부")
    analysis: Dict[str, Any] = Field(..., description="분석 결과")
    message: Optional[str] = Field(None, description="메시지")
    model_used: Optional[str] = Field(None, description="사용된 모델")


class CoverLetterGenerationRequest(BaseModel):
    user_id: str = Field(..., description="사용자 ID")
    question: str = Field(..., description="자기소개서 문항")
    blocks: List[str] = Field(..., description="활용할 블록 내용")
    references: Optional[List[str]] = Field(None, description="참고 자기소개서")
    job_analysis: Optional[Dict[str, Any]] = Field(None, description="채용공고 분석 결과")
    char_limit: Optional[int] = Field(None, description="글자수 제한")
    company_name: Optional[str] = Field(None, description="기업명")
    position: Optional[str] = Field(None, description="직무명")
    model_type: Optional[str] = Field(None, description="AI 모델 (gpt, gemini, gemini-flash, claude)")


class CoverLetterGenerationResponse(BaseModel):
    success: bool = Field(..., description="성공 여부")
    content: str = Field(..., description="생성된 자기소개서")
    message: Optional[str] = Field(None, description="메시지")
    model_used: Optional[str] = Field(None, description="사용된 모델")


class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="서비스 상태")
    version: str = Field(..., description="버전")
    available_models: List[str] = Field(
        default=["gpt", "gemini", "gemini-flash", "claude"],
        description="사용 가능한 모델"
    )


class EnhancedCoverLetterRequest(BaseModel):
    """Enhanced 자기소개서 생성 요청 (스크래핑 + 검색 + COT 스트리밍)"""
    user_id: str = Field(..., description="사용자 ID")
    question: str = Field(..., description="자기소개서 문항")
    blocks: List[str] = Field(..., description="활용할 블록 내용")
    company_name: str = Field(..., description="기업명")
    position: str = Field(..., description="직무명")
    poster_url: Optional[str] = Field(None, description="채용공고 포스터 URL (자소설닷컴)")
    fallback_content: Optional[str] = Field(None, description="본문 텍스트 (URL 없을 시 사용)")
    references: Optional[List[str]] = Field(None, description="참고 자기소개서")
    char_limit: Optional[int] = Field(800, description="글자수 제한")
    model_type: Optional[str] = Field(None, description="AI 모델 (gpt, gemini, gemini-flash, claude)")


class SmartGenerationRequest(BaseModel):
    """스마트 자기소개서 생성 요청 (블록/자소서 자동 선택 + 생성)"""
    user_id: str = Field(..., description="사용자 ID")
    question: str = Field(..., description="자기소개서 문항")
    company_name: str = Field(..., description="기업명")
    position: str = Field(..., description="직무명")
    
    # 블록/자소서를 직접 전달하거나, Spring API에서 가져올 수 있음
    blocks: Optional[List[Dict[str, Any]]] = Field(None, description="활용 가능한 블록 목록 [{category, content, keywords}]")
    cover_letters: Optional[List[Dict[str, Any]]] = Field(None, description="참고 가능한 기존 자소서 [{company, question, content}]")
    
    # 채용공고 정보
    poster_url: Optional[str] = Field(None, description="채용공고 포스터 URL")
    fallback_content: Optional[str] = Field(None, description="채용공고 본문 텍스트")
    job_analysis: Optional[Dict[str, Any]] = Field(None, description="사전 분석된 채용공고 정보")
    
    char_limit: Optional[int] = Field(800, description="글자수 제한")
    model_type: Optional[str] = Field(None, description="AI 모델")
    auth_token: Optional[str] = Field(None, description="Spring API 인증 토큰")


class SelectedGenerationRequest(BaseModel):
    """선택된 블록/자소서로 자기소개서 생성 요청 (사용자가 직접 선택)"""
    user_id: str = Field(..., description="사용자 ID")
    question: str = Field(..., description="자기소개서 문항")
    company_name: str = Field(..., description="기업명")
    position: str = Field(..., description="직무명")
    
    # ID로 특정 블록/자소서 선택
    block_ids: Optional[List[str]] = Field(None, description="선택한 블록 ID 목록")
    cover_letter_ids: Optional[List[str]] = Field(None, description="선택한 자소서 ID 목록")
    
    # 또는 직접 데이터 전달
    blocks: Optional[List[Dict[str, Any]]] = Field(None, description="블록 데이터 직접 전달")
    cover_letters: Optional[List[Dict[str, Any]]] = Field(None, description="자소서 데이터 직접 전달")
    
    # 채용공고 정보
    poster_url: Optional[str] = Field(None, description="채용공고 포스터 URL")
    fallback_content: Optional[str] = Field(None, description="채용공고 본문 텍스트")
    job_analysis: Optional[Dict[str, Any]] = Field(None, description="채용공고 분석 결과")
    
    char_limit: Optional[int] = Field(800, description="글자수 제한")
    model_type: Optional[str] = Field(None, description="AI 모델")
    auth_token: Optional[str] = Field(None, description="Spring API 인증 토큰")
