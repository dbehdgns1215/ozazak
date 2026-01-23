"""
FastAPI 메인 애플리케이션
자기소개서 AI 생성 서비스
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.config.settings import settings
from .schemas import (
    BlockGenerationRequest,
    BlockGenerationResponse,
    CoverLetterGenerationRequest,
    CoverLetterGenerationResponse,
    HealthCheckResponse,
    BlockData
)
from src.adapters.outbound.llm.openai_adapter import get_llm_adapter
from src import __version__


# FastAPI 앱 생성
app = FastAPI(
    title="자기소개서 AI 생성 API",
    description="LangChain과 OpenAI GPT-4를 활용한 자기소개서 자동 생성 서비스",
    version=__version__
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthCheckResponse)
async def root():
    """루트 엔드포인트 - Health Check"""
    return HealthCheckResponse(
        status="healthy",
        version=__version__
    )


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """헬스 체크"""
    return HealthCheckResponse(
        status="healthy",
        version=__version__
    )


@app.post("/api/ai/blocks/generate", response_model=BlockGenerationResponse)
async def generate_blocks(request: BlockGenerationRequest):
    """
    블록 생성 API
    
    프로젝트 정보나 이전 자기소개서로부터 재사용 가능한 블록을 추출합니다.
    
    **헥사고날 아키텍처에서의 위치:**
    - 이 엔드포인트는 Inbound Adapter (REST API)입니다
    - LLM Adapter (Outbound)를 통해 LangChain 호출합니다
    """
    try:
        # LLM Adapter 인스턴스 가져오기
        llm_adapter = get_llm_adapter()
        
        # 소스 타입에 따라 다른 메서드 호출
        if request.source_type == "project":
            blocks_data = await llm_adapter.extract_blocks_from_project(
                request.source_content
            )
        else:  # cover_letter
            # 자기소개서의 경우 간단히 전체 내용을 파싱
            blocks_data = await llm_adapter.extract_blocks_from_cover_letter(
                question="자기소개서",
                essay=request.source_content
            )
        
        # 응답 변환
        blocks = [
            BlockData(
                category=block.get("category", "UNKNOWN"),
                content=block.get("content", ""),
                keywords=block.get("keywords", [])
            )
            for block in blocks_data
        ]
        
        return BlockGenerationResponse(
            success=True,
            blocks=blocks,
            message=f"{len(blocks)}개의 블록이 생성되었습니다."
        )
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "blocks": [],
                "message": f"블록 생성 중 오류 발생: {str(e)}"
            }
        )


@app.post("/api/ai/cover-letters/generate", response_model=CoverLetterGenerationResponse)
async def generate_cover_letter(request: CoverLetterGenerationRequest):
    """
    자기소개서 생성 API
    
    주어진 블록들과 참고 자료를 활용하여 문항에 맞는 자기소개서를 생성합니다.
    
    **헥사고날 아키텍처에서의 위치:**
    - 이 엔드포인트는 Inbound Adapter (REST API)입니다
    - LLM Adapter (Outbound)를 통해 LangChain 호출합니다
    """
    try:
        # LLM Adapter 인스턴스 가져오기
        llm_adapter = get_llm_adapter()
        
        # 자기소개서 생성
        content = await llm_adapter.generate_cover_letter(
            question=request.question,
            blocks=request.blocks,
            references=request.references
        )
        
        return CoverLetterGenerationResponse(
            success=True,
            content=content,
            message="자기소개서가 성공적으로 생성되었습니다."
        )
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "content": "",
                "message": f"자기소개서 생성 중 오류 발생: {str(e)}"
            }
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_env == "development"
    )
