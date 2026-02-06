from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse
from typing import List, Optional, Dict, Any
import logging
import json

# 로깅 설정 (INFO 레벨로 설정하여 DEBUG 로그 출력)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

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
    BackendGenerateRequest,  # 백엔드 호환 스키마
    CoverLetterRefinementRequest,
    EmbeddingRequest,
    EmbeddingResponse
)

# Adapters
from src.adapters.inbound.rest.schemas import EnhancedCoverLetterRequest
from src.adapters.outbound.llm.chains.schemas import FinalOutput
from src.adapters.outbound.llm.llm_factory import get_llm_adapter
from src.adapters.outbound.api.spring_client import SpringAPIClient

# Use Cases
from src.application.use_cases.generate_blocks import GenerateBlocksUseCase
from src.application.use_cases.analyze_job_posting import AnalyzeJobPostingUseCase
from src.application.use_cases.generate_cover_letter import GenerateSmartCoverLetterUseCase, GenerateSelectedCoverLetterUseCase
from src.application.use_cases.refine_cover_letter import RefineCoverLetterUseCase
from src.application.use_cases.generate_enhanced_cover_letter import GenerateEnhancedCoverLetterUseCase

# DTOs
from src.application.dtos.requests import (
    GenerateBlocksRequestDTO, 
    AnalyzeJobPostingRequestDTO,
    SmartGenerationRequestDTO,
    SelectedGenerationRequestDTO,
    CoverLetterRefinementRequestDTO,
    EnhancedCoverLetterRequestDTO
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

# 422 Validation Error 핸들러 (디버깅용)
from fastapi.exceptions import RequestValidationError
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = await request.body()
    logger.error(f"[422 VALIDATION ERROR] Path: {request.url.path}")
    logger.error(f"[422 VALIDATION ERROR] Raw body: {body.decode('utf-8')}")
    logger.error(f"[422 VALIDATION ERROR] Errors: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": body.decode('utf-8')}
    )


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
                keywords=block.keywords,
                embedding=block.embedding
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


@app.post("/api/ai/cover-letters/generate")
async def generate_cover_letter_sync(request: BackendGenerateRequest):
    """자소서 생성 (비스트리밍) - Java 백엔드용 (camelCase 호환)"""
    try:
        # 디버깅: 백엔드 요청 로깅
        logger.info(f"[BACKEND REQUEST] Received generate request")
        logger.info(f"  - company_name: {request.company_name}")
        logger.info(f"  - position: {request.position}")
        logger.info(f"  - question: {request.question[:50]}..." if request.question and len(request.question) > 50 else f"  - question: {request.question}")
        logger.info(f"  - blocks count: {len(request.blocks) if request.blocks else 0}")
        logger.info(f"  - cover_letters count: {len(request.cover_letters) if request.cover_letters else 0}")
        logger.info(f"  - user_prompt: {request.user_prompt}")
        logger.info(f"  - char_limit: {request.char_limit}")
        logger.info(f"  - model_type: {request.model_type}")
        logger.info(f"  - recruitment_content: {len(request.recruitment_content) if request.recruitment_content else 0} chars")

        # 필수 파라미터 검증
        if not request.question or not request.question.strip():
            logger.error("[VALIDATION ERROR] question is empty or null")
            return {"content": None, "error": "question 필드가 비어있습니다. 백엔드에서 문항 내용을 확인하세요."}

        llm_adapter = get_llm_adapter(request.model_type)
        backend_client = SpringAPIClient()
        use_case = GenerateSelectedCoverLetterUseCase(llm_adapter, backend_client)
        
        # 백엔드 요청 → 내부 DTO 변환 (이미 snake_case로 통일됨)
        blocks_content = []
        if request.blocks:
            blocks_content = [b.get("content", "") for b in request.blocks]
        
        cover_letters_content = []
        if request.cover_letters:
            cover_letters_content = [e.get("content", "") for e in request.cover_letters]
        
        logger.info(f"  - recruitment_url: {request.recruitment_url}")  # Added logging
        
        req_dto = SelectedGenerationRequestDTO(
            question=request.question,
            blocks=blocks_content,
            cover_letters=cover_letters_content,
            block_ids=None,
            cover_letter_ids=None,
            company_name=request.company_name,
            position=request.position,
            job_analysis=request.job_analysis,
            poster_url=request.recruitment_url,  # Pass URL from backend
            fallback_content=request.recruitment_content,

            user_prompt=request.user_prompt,
            char_limit=request.char_limit or 800,
            save_to_backend=False,
            coverletter_id=None,
            question_id=None,
            auth_token=None,
            model_type=request.model_type,
            recruitment_end_date=request.recruitment_end_date  # 동적 TTL
        )
        
        # 스트리밍 결과를 모아서 반환
        full_content = ""
        async for event in use_case.execute(req_dto):
            # StepCompleteEvent에서 generating step의 content 추출
            if hasattr(event, 'step') and event.step == 'generating':
                if hasattr(event, 'data') and event.data:
                    content = event.data.get('content', '')
                    if content:
                        full_content = content
            # ChunkEvent에서 content 추가 (스트리밍 중간 결과)
            elif hasattr(event, 'chunk') and event.chunk:
                full_content += event.chunk
        
        logger.info(f"Generated content length: {len(full_content)}")
        return {"content": full_content, "error": None}
        
    except Exception as e:
        logger.error(f"Generate cover letter error: {str(e)}")
        return {"content": None, "error": str(e)}


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
            
            # 3. Create Request DTO
            req_dto = SelectedGenerationRequestDTO(
                question=request.question,
                blocks=request.blocks,
                cover_letters=request.cover_letters,
                block_ids=request.block_ids,
                cover_letter_ids=request.cover_letter_ids,
                company_name=request.company_name,
                position=request.position,
                job_analysis=request.job_analysis,
                poster_url=request.poster_url,
                fallback_content=request.fallback_content,
                user_prompt=request.user_prompt,  # 사용자 지시사항 전달
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


@app.post("/api/ai/embeddings", response_model=EmbeddingResponse)
async def generate_embedding(request: EmbeddingRequest):
    """텍스트 임베딩 생성 API (수동 블록 생성용)"""
    try:
        from langchain_openai import OpenAIEmbeddings
        
        embeddings = OpenAIEmbeddings(
            model="text-embedding-3-large",
            dimensions=1536,
            openai_api_key=settings.gms_api_key,
            base_url="https://gms.ssafy.io/gmsapi/api.openai.com/v1"
        )
        
        vector = await embeddings.aembed_query(request.text)
        
        return EmbeddingResponse(
            success=True,
            embedding=vector,
            message="임베딩 생성 완료"
        )
    except Exception as e:
        logger.error(f"Embedding generation error: {str(e)}")
        return JSONResponse(status_code=500, content={
            "success": False,
            "embedding": [],
            "message": f"임베딩 생성 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/cover-letters/enhanced", response_model=FinalOutput)
async def generate_enhanced_cover_letter(request: EnhancedCoverLetterRequest):
    """Enhanced 자기소개서 생성 (Search + Scrape + Pipeline)"""
    try:
        llm_adapter = get_llm_adapter(request.model_type)
        use_case = GenerateEnhancedCoverLetterUseCase(llm_adapter)
        
        req_dto = EnhancedCoverLetterRequestDTO(
            question=request.question,
            blocks=request.blocks,
            company_name=request.company_name,
            position=request.position,
            poster_url=request.poster_url,
            fallback_content=request.fallback_content,
            char_limit=request.char_limit,
            model_type=request.model_type
        )
        
        result = await use_case.execute(req_dto)
        return result
        
    except Exception as e:
        logger.error(f"Enhanced generation error: {str(e)}")
        # 에러 응답은 JSONResponse로 처리
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/ai/debug/vision-test")
async def debug_vision_test(image_url: str, model_type: str = "gemini-flash"):
    """Vision 모델 직접 테스트"""
    try:
        llm_adapter = get_llm_adapter(model_type)
        
        # 1. vision_llm 존재 여부
        has_vision = hasattr(llm_adapter, 'vision_llm')
        vision_type = type(llm_adapter.vision_llm).__name__ if has_vision else None
        
        # 2. 이미지 다운로드 테스트
        import httpx
        async with httpx.AsyncClient(timeout=10) as client:
            img_response = await client.get(image_url)
            img_status = img_response.status_code
            img_size = len(img_response.content)
        
        # 3. Vision 호출 테스트
        from langchain_core.messages import HumanMessage
        message = HumanMessage(content=[
            {"type": "text", "text": "이 이미지를 설명해주세요."},
            {"type": "image_url", "image_url": {"url": image_url}}
        ])
        
        result = await llm_adapter.vision_llm.ainvoke([message])
        
        return {
            "success": True,
            "vision_llm_type": vision_type,
            "image_download": {"status": img_status, "size": img_size},
            "vision_response": result.content[:500]
        }
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }
