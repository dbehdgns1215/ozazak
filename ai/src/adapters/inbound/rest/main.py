"""FastAPI 메인 애플리케이션 (고도화 버전)"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.config.settings import settings
from .schemas import (
    BlockGenerationRequest,
    BlockGenerationResponse,
    CoverLetterGenerationRequest,
    CoverLetterGenerationResponse,
    JobPostingAnalysisRequest,
    JobPostingAnalysisResponse,
    HealthCheckResponse,
    BlockData
)
from src.adapters.outbound.llm.openai_adapter import get_llm_adapter
from src import __version__


app = FastAPI(
    title="자기소개서 AI 생성 API",
    description="LangChain과 OpenAI GPT-4를 활용한 자기소개서 자동 생성 서비스 (고도화 버전)",
    version=__version__
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthCheckResponse)
async def root():
    return HealthCheckResponse(status="healthy", version=__version__)


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(status="healthy", version=__version__)


@app.post("/api/ai/blocks/generate", response_model=BlockGenerationResponse)
async def generate_blocks(request: BlockGenerationRequest):
    """블록 생성 API"""
    try:
        llm_adapter = get_llm_adapter()
        
        if request.source_type == "project":
            blocks_data = await llm_adapter.extract_blocks_from_project(request.source_content)
        else:
            blocks_data = await llm_adapter.extract_blocks_from_cover_letter(
                question="자기소개서", essay=request.source_content
            )
        
        blocks = [
            BlockData(
                category=block.get("category", "UNKNOWN"),
                content=block.get("content", ""),
                keywords=block.get("keywords", [])
            )
            for block in blocks_data
        ]
        
        return BlockGenerationResponse(
            success=True, blocks=blocks,
            message=f"{len(blocks)}개의 블록이 생성되었습니다."
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "blocks": [],
            "message": f"블록 생성 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/job-postings/analyze", response_model=JobPostingAnalysisResponse)
async def analyze_job_posting(request: JobPostingAnalysisRequest):
    """채용공고 분석 API"""
    try:
        llm_adapter = get_llm_adapter()
        
        analysis = await llm_adapter.analyze_job_posting(
            company_name=request.company_name,
            position=request.position,
            job_posting=request.job_posting,
            requirements=request.requirements
        )
        
        return JobPostingAnalysisResponse(
            success=True, analysis=analysis,
            message="채용공고 분석이 완료되었습니다."
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "analysis": {},
            "message": f"채용공고 분석 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/cover-letters/generate", response_model=CoverLetterGenerationResponse)
async def generate_cover_letter(request: CoverLetterGenerationRequest):
    """자기소개서 생성 API (고도화 버전)"""
    try:
        llm_adapter = get_llm_adapter()
        
        content = await llm_adapter.generate_cover_letter(
            question=request.question,
            blocks=request.blocks,
            references=request.references,
            job_analysis=request.job_analysis,
            char_limit=request.char_limit,
            company_name=request.company_name,
            position=request.position
        )
        
        return CoverLetterGenerationResponse(
            success=True, content=content,
            message="자기소개서가 성공적으로 생성되었습니다."
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "content": "",
            "message": f"자기소개서 생성 중 오류 발생: {str(e)}"
        })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_env == "development"
    )
