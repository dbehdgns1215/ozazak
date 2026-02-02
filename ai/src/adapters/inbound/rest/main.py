from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse
from typing import List, Optional, Dict, Any
import logging
import json

from src.config.settings import settings
from src.adapters.inbound.rest.schemas import (
    BlockGenerationRequest, 
    BlockGenerationResponse, 
    BlockData,
    HealthCheckResponse,
    JobPostingAnalysisRequest,
    JobPostingAnalysisResponse,
    SmartGenerationRequest,
    SelectedGenerationRequest,
    CoverLetterRefinementRequest
)

# Adapters
from src.adapters.outbound.llm.llm_factory import get_llm_adapter
from src.adapters.outbound.api.spring_client import SpringAPIClient

# Use Cases
from src.application.use_cases.generate_blocks import GenerateBlocksUseCase
from src.application.use_cases.analyze_job_posting import AnalyzeJobPostingUseCase
from src.application.use_cases.generate_cover_letter import GenerateSmartCoverLetterUseCase, GenerateSelectedCoverLetterUseCase
from src.application.use_cases.refine_cover_letter import RefineCoverLetterUseCase

# DTOs
from src.application.dtos.requests import (
    GenerateBlocksRequestDTO, 
    AnalyzeJobPostingRequestDTO,
    SmartGenerationRequestDTO,
    SelectedGenerationRequestDTO,
    CoverLetterRefinementRequestDTO
)
from src.domain.exceptions import DomainError, InvalidRequestError, GenerationError

from src import __version__


logger = logging.getLogger(__name__)

app = FastAPI(
    title="자기소개서 AI 생성 API",
    description="LangChain 기반 자기소개서 자동 생성 서비스 (GPT, Gemini, Claude 지원)",
    version=__version__
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(InvalidRequestError)
async def invalid_request_handler(request, exc):
    return JSONResponse(status_code=400, content={"error": str(exc)})

@app.exception_handler(GenerationError)
async def generation_error_handler(request, exc):
    return JSONResponse(status_code=500, content={"error": str(exc)})


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """서버 상태 확인"""
    return HealthCheckResponse(
        status="ok",
        version=__version__,
        model=settings.default_model,
        available_models=settings.available_models or ["gpt", "gemini", "gemini-flash", "claude"]
    )


@app.post("/api/ai/blocks/generate", response_model=BlockGenerationResponse)
async def generate_blocks(request: BlockGenerationRequest):
    """블록 생성 API"""
    try:
        llm_adapter = get_llm_adapter(request.model_type)
        use_case = GenerateBlocksUseCase(llm_adapter)
        
        req_dto = GenerateBlocksRequestDTO(
            source_type=request.source_type,
            source_content=request.source_content,
            model_type=request.model_type
        )
        
        blocks = await use_case.execute(req_dto)
        
        response_blocks = [
            BlockData(
                category=block.category,
                content=block.content,
                keywords=block.keywords
            )
            for block in blocks
        ]
        
        return BlockGenerationResponse(
            success=True, blocks=response_blocks,
            message=f"{len(blocks)}개의 블록이 생성되었습니다.",
            model_used=request.model_type or settings.default_model
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
        llm_adapter = get_llm_adapter(request.model_type)
        use_case = AnalyzeJobPostingUseCase(llm_adapter)
        
        req_dto = AnalyzeJobPostingRequestDTO(
            company_name=request.company_name,
            position=request.position,
            job_posting=request.job_posting,
            requirements=request.requirements,
            model_type=request.model_type
        )
        
        analysis = await use_case.execute(req_dto)
        
        # VO to Dict for Response
        # analysis is JobAnalysis VO
        analysis_dict = {
            "responsibilities": analysis.responsibilities,
            "requirements": analysis.requirements,
            "preferred_qualifications": analysis.preferred_qualifications,
            "ideal_candidate": analysis.ideal_candidate,
            "yearly_goals": analysis.yearly_goals,
            "company_name": analysis.company_name,
            "position": analysis.position,
            "keywords": analysis.yearly_goals if isinstance(analysis.yearly_goals, list) else [], # Compatibility
            "core_competencies": analysis.preferred_qualifications, # Compatibility
            "key_responsibilities": analysis.responsibilities # Compatibility
        }
        
        return JobPostingAnalysisResponse(
            success=True, analysis=analysis_dict,
            message="채용공고 분석이 완료되었습니다.",
            model_used=request.model_type or settings.default_model
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "analysis": {},
            "message": f"채용공고 분석 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/cover-letters/smart")
async def stream_smart_generation(request: SmartGenerationRequest):
    """스마트 선택 + 자소서 생성 (SSE 스트리밍) - UseCase 적용"""
    
    async def event_generator():
        try:
            # 1. Initialize Adapters
            llm_adapter = get_llm_adapter(request.model_type)
            backend_client = SpringAPIClient()
            
            # 2. Initialize UseCase
            use_case = GenerateSmartCoverLetterUseCase(llm_adapter, backend_client)
            
            # 3. Create Request DTO
            # Map Pydantic Model to DTO
            req_dto = SmartGenerationRequestDTO(
                question=request.question,
                company_name=request.company_name,
                position=request.position,
                user_id=request.user_id,
                coverletter_id=request.coverletter_id,
                question_id=request.question_id,
                blocks=request.blocks,
                cover_letters=request.cover_letters,
                job_analysis=request.job_analysis,
                poster_url=request.poster_url,
                fallback_content=request.fallback_content,
                save_to_backend=request.save_to_backend,
                auth_token=request.auth_token,
                char_limit=request.char_limit,
                model_type=request.model_type
            )
            
            # 4. Execute
            async for event in use_case.execute(req_dto):
                # Convert Event DTO to dict for SSE
                yield {
                    "event": event.event,
                    "data": json.dumps(vars(event) if hasattr(event, "__dict__") else event, ensure_ascii=False)
                }
                
        except Exception as e:
            logger.error(f"Smart generation error: {str(e)}")
            yield {
                "event": "error",
                "data": json.dumps({"message": str(e)}, ensure_ascii=False)
            }

    return EventSourceResponse(event_generator())


@app.post("/api/ai/cover-letters/selected")
async def stream_selected_generation(request: SelectedGenerationRequest):
    """선택된 블록으로 자소서 생성 (SSE 스트리밍) - UseCase 적용"""
    
    async def event_generator():
        try:
            # 1. Initialize Adapters
            llm_adapter = get_llm_adapter(request.model_type)
            backend_client = SpringAPIClient()
            
            # 2. Initialize UseCase
            use_case = GenerateSelectedCoverLetterUseCase(llm_adapter, backend_client)
            
            # 3. Create Request DTO (using helper methods for Backend compatibility)
            req_dto = SelectedGenerationRequestDTO(
                question=request.question,
                blocks=request.get_blocks(),  # reference_blocks or blocks
                cover_letters=request.get_essays(),  # reference_essays or cover_letters
                block_ids=request.block_ids,
                cover_letter_ids=request.cover_letter_ids,
                company_name=request.get_company_name(),  # company or company_name
                position=request.get_position(),  # recruitment_title or position
                job_analysis=request.get_job_analysis(),  # recruitment_analysis or job_analysis
                poster_url=request.poster_url,
                fallback_content=request.fallback_content,
                char_limit=request.char_limit,
                save_to_backend=request.save_to_backend,
                coverletter_id=request.coverletter_id,
                question_id=request.question_id,
                auth_token=request.auth_token,
                model_type=request.model_type
            )
            
            # 4. Execute
            async for event in use_case.execute(req_dto):
                # Convert Event DTO to dict for SSE
                yield {
                    "event": event.event,
                    "data": json.dumps(vars(event) if hasattr(event, "__dict__") else event, ensure_ascii=False)
                }
                
        except Exception as e:
            logger.error(f"Selected generation error: {str(e)}")
            yield {
                "event": "error",
                "data": json.dumps({"message": str(e)}, ensure_ascii=False)
            }

    return EventSourceResponse(event_generator())


# Backend 호환용 동기 엔드포인트 (SSE 대신 JSON 응답)
@app.post("/api/ai/cover-letters/selected/sync")
async def sync_selected_generation(request: SelectedGenerationRequest):
    """선택된 블록으로 자소서 생성 (동기 - Backend 호환)
    
    Returns:
        {"content": "생성된 자소서", "error": null}
    """
    try:
        # 1. Initialize Adapters
        llm_adapter = get_llm_adapter(request.model_type)
        backend_client = SpringAPIClient()
        
        # 2. Initialize UseCase
        use_case = GenerateSelectedCoverLetterUseCase(llm_adapter, backend_client)
        
        # 3. Create Request DTO
        req_dto = SelectedGenerationRequestDTO(
            question=request.question,
            blocks=request.get_blocks(),
            cover_letters=request.get_essays(),
            block_ids=request.block_ids,
            cover_letter_ids=request.cover_letter_ids,
            company_name=request.get_company_name(),
            position=request.get_position(),
            job_analysis=request.get_job_analysis(),
            poster_url=request.poster_url,
            fallback_content=request.fallback_content,
            char_limit=request.char_limit,
            save_to_backend=False,  # Backend가 직접 저장
            coverletter_id=request.coverletter_id,
            question_id=request.question_id,
            auth_token=request.auth_token,
            model_type=request.model_type
        )
        
        # 4. Execute and collect result
        generated_content = ""
        async for event in use_case.execute(req_dto):
            if hasattr(event, 'event') and event.event == "done":
                break
            if hasattr(event, 'data') and hasattr(event.data, 'get'):
                content = event.data.get("content")
                if content:
                    generated_content = content
            elif hasattr(event, 'content'):
                generated_content = event.content
        
        return {"content": generated_content, "error": None}
        
    except Exception as e:
        logger.error(f"Sync selected generation error: {str(e)}")
        return {"content": None, "error": str(e)}




@app.post("/api/ai/cover-letters/refine")
async def refine_cover_letter(request: CoverLetterRefinementRequest):
    """자기소개서 첨삭/수정 API (SSE 스트리밍) - UseCase 적용"""
    async def event_generator():
        try:
            # 1. Initialize Adapters
            llm_adapter = get_llm_adapter(request.model_type)
            backend_client = SpringAPIClient()
            
            # 2. Initialize UseCase
            use_case = RefineCoverLetterUseCase(llm_adapter, backend_client)
            
            # 3. Create Request DTO
            req_dto = CoverLetterRefinementRequestDTO(
                question=request.question,
                original_content=request.original_content,
                feedback=request.feedback,
                cover_letter_id=request.coverletter_id, # Schema has coverletter_id (camelCase in JSON but python snake_case?) need to check schema
                question_id=request.question_id,
                company_name=request.company_name,
                position=request.position,
                save_to_backend=request.save_to_backend,
                auth_token=request.auth_token,
                model_type=request.model_type,
                char_limit=request.char_limit
            )
            
            # 4. Execute
            async for event in use_case.execute(req_dto):
                yield {
                    "event": event.event,
                    "data": json.dumps(vars(event) if hasattr(event, "__dict__") else event, ensure_ascii=False)
                }
                
        except Exception as e:
            logger.error(f"Refinement error: {str(e)}")
            yield {
                "event": "error",
                "data": json.dumps({"message": str(e)}, ensure_ascii=False)
            }
            
    return EventSourceResponse(event_generator())
