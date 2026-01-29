"""COT(Chain of Thought) 이벤트 타입 정의"""
from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List
from enum import Enum
import json


class COTEventType(str, Enum):
    """COT 스트리밍 이벤트 타입"""
    STEP_START = "step_start"       # 단계 시작
    STEP_PROGRESS = "step_progress" # 단계 진행 중
    STEP_COMPLETE = "step_complete" # 단계 완료
    THINKING = "thinking"           # AI 사고 과정
    CONTENT = "content"             # 생성된 콘텐츠
    ERROR = "error"                 # 에러 발생
    DONE = "done"                   # 전체 완료


class COTStep(str, Enum):
    """COT 파이프라인 단계"""
    SCRAPING = "scraping"           # 포스터 스크래핑
    SEARCHING = "searching"         # 기업 정보 검색
    ANALYZING = "analyzing"         # 정보 분석
    GENERATING = "generating"       # 자기소개서 생성


@dataclass
class COTEvent:
    """COT 스트리밍 이벤트"""
    event_type: COTEventType
    step: Optional[COTStep] = None
    message: str = ""
    data: Optional[Dict[str, Any]] = None
    chunk: str = ""
    
    def to_sse(self) -> str:
        """Server-Sent Events 형식으로 변환"""
        payload = {
            "event": self.event_type.value,
        }
        
        if self.step:
            payload["step"] = self.step.value
        if self.message:
            payload["message"] = self.message
        if self.data:
            payload["data"] = self.data
        if self.chunk:
            payload["chunk"] = self.chunk
            
        return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"
    
    @classmethod
    def step_start(cls, step: COTStep, message: str) -> "COTEvent":
        """단계 시작 이벤트 생성"""
        return cls(
            event_type=COTEventType.STEP_START,
            step=step,
            message=message
        )
    
    @classmethod
    def step_complete(cls, step: COTStep, data: Dict = None) -> "COTEvent":
        """단계 완료 이벤트 생성"""
        return cls(
            event_type=COTEventType.STEP_COMPLETE,
            step=step,
            data=data or {}
        )
    
    @classmethod
    def thinking(cls, message: str, step: COTStep = None) -> "COTEvent":
        """사고 과정 이벤트 생성"""
        return cls(
            event_type=COTEventType.THINKING,
            step=step,
            message=message
        )
    
    @classmethod
    def content(cls, chunk: str) -> "COTEvent":
        """콘텐츠 청크 이벤트 생성"""
        return cls(
            event_type=COTEventType.CONTENT,
            chunk=chunk
        )
    
    @classmethod
    def error(cls, message: str, step: COTStep = None) -> "COTEvent":
        """에러 이벤트 생성"""
        return cls(
            event_type=COTEventType.ERROR,
            step=step,
            message=message
        )
    
    @classmethod
    def done(cls, data: Dict = None) -> "COTEvent":
        """완료 이벤트 생성"""
        return cls(
            event_type=COTEventType.DONE,
            data=data or {}
        )
