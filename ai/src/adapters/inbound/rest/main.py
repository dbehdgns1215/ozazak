"""FastAPI 메인 애플리케이션 (멀티 모델 지원)"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from src.config.settings import settings
from .schemas import (
    BlockGenerationRequest,
    BlockGenerationResponse,
    CoverLetterGenerationRequest,
    CoverLetterGenerationResponse,
    JobPostingAnalysisRequest,
    JobPostingAnalysisResponse,
    HealthCheckResponse,
    BlockData,
    EnhancedCoverLetterRequest,
    SmartGenerationRequest,
    SelectedGenerationRequest
)
from src.adapters.outbound.llm.llm_factory import get_llm_adapter
from src.adapters.outbound.llm.chains.enhanced_pipeline_chain import EnhancedPipelineChain
from src.adapters.outbound.llm.chains.smart_generation_chain import SmartGenerationChain
from src.adapters.outbound.llm.chains.enhanced_utils import run_enhanced_analysis
from src.adapters.outbound.api.spring_client import SpringAPIClient
from src import __version__


app = FastAPI(
    title="자기소개서 AI 생성 API",
    description="LangChain 기반 자기소개서 자동 생성 서비스 (GPT, Gemini, Claude 지원)",
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
    return HealthCheckResponse(
        status="healthy",
        version=__version__,
        available_models=["gpt", "gemini", "gemini-flash", "claude"]
    )


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(
        status="healthy",
        version=__version__,
        available_models=["gpt", "gemini", "gemini-flash", "claude"]
    )


@app.post("/api/ai/blocks/generate", response_model=BlockGenerationResponse)
async def generate_blocks(request: BlockGenerationRequest):
    """블록 생성 API"""
    try:
        llm_adapter = get_llm_adapter(request.model_type)
        model_used = request.model_type or settings.default_model
        
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
            message=f"{len(blocks)}개의 블록이 생성되었습니다.",
            model_used=model_used
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
        model_used = request.model_type or settings.default_model
        
        analysis = await llm_adapter.analyze_job_posting(
            company_name=request.company_name,
            position=request.position,
            job_posting=request.job_posting,
            requirements=request.requirements
        )
        
        return JobPostingAnalysisResponse(
            success=True, analysis=analysis,
            message="채용공고 분석이 완료되었습니다.",
            model_used=model_used
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "analysis": {},
            "message": f"채용공고 분석 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/cover-letters/generate", response_model=CoverLetterGenerationResponse)
async def generate_cover_letter(request: CoverLetterGenerationRequest):
    """자기소개서 생성 API"""
    try:
        llm_adapter = get_llm_adapter(request.model_type)
        model_used = request.model_type or settings.default_model
        
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
            message="자기소개서가 성공적으로 생성되었습니다.",
            model_used=model_used
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "content": "",
            "message": f"자기소개서 생성 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/cover-letters/generate/stream")
async def generate_cover_letter_stream(request: CoverLetterGenerationRequest):
    """자기소개서 생성 API (스트리밍)"""
    try:
        llm_adapter = get_llm_adapter(request.model_type)
        model_used = request.model_type or settings.default_model
        
        async def event_generator():
            try:
                # 시작 이벤트
                import json
                import asyncio
                
                # 1. 프로세스 시작 알림
                start_payload = json.dumps({
                    "status": "start",
                    "model": model_used
                }, ensure_ascii=False)
                yield f"data: {start_payload}\n\n"
                
                # 2. 채용공고 및 직무 분석 메세지 (데이터가 있는 경우)
                if request.job_analysis:
                    await asyncio.sleep(0.5)
                    keywords = request.job_analysis.get("keywords", [])
                    key_msg = f"'{keywords[0]}'" if keywords else "핵심 역량"
                    if len(keywords) > 1:
                        key_msg += f", '{keywords[1]}'"
                    
                    step1_payload = json.dumps({
                        "type": "progress",
                        "message": f"채용공고에서 {key_msg} 키워드 분석 중..."
                    }, ensure_ascii=False)
                    yield f"data: {step1_payload}\n\n"
                
                # 3. 블록 데이터 로드 메시지
                if request.blocks:
                    await asyncio.sleep(0.5)
                    # 블록 내용 요약 (앞 2개 블록의 앞 10글자 정도만 보여줌)
                    block_summaries = []
                    for block in request.blocks[:2]:
                        summary = block[:15] + "..." if len(block) > 15 else block
                        block_summaries.append(f"'{summary}'")
                    
                    block_msg = ", ".join(block_summaries)
                    if len(request.blocks) > 2:
                        block_msg += f" 외 {len(request.blocks)-2}개"
                        
                    step2_payload = json.dumps({
                        "type": "progress",
                        "message": f"경험 블록 확인 중: {block_msg}"
                    }, ensure_ascii=False)
                    yield f"data: {step2_payload}\n\n"
                
                # 4. 생성 시작 메시지
                await asyncio.sleep(0.5)
                step3_payload = json.dumps({
                    "type": "progress",
                    "message": "분석된 내용을 바탕으로 자기소개서 작성 시작..."
                }, ensure_ascii=False)
                yield f"data: {step3_payload}\n\n"
                
                async for chunk in llm_adapter.stream_cover_letter(
                    question=request.question,
                    blocks=request.blocks,
                    references=request.references,
                    job_analysis=request.job_analysis,
                    char_limit=request.char_limit,
                    company_name=request.company_name,
                    position=request.position
                ):
                    payload = json.dumps({
                        "type": "content", 
                        "content": chunk
                    }, ensure_ascii=False)
                    yield f"data: {payload}\n\n"
                
                # 종료 이벤트
                done_payload = json.dumps({"status": "done"}, ensure_ascii=False)
                yield f"data: {done_payload}\n\n"
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                import json
                error_payload = json.dumps({"error": str(e)}, ensure_ascii=False)
                yield f"data: {error_payload}\n\n"
        
        return StreamingResponse(event_generator(), media_type="text/event-stream")
        
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "message": f"초기화 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/cover-letters/generate/enhanced/stream")
async def generate_cover_letter_enhanced_stream(request: EnhancedCoverLetterRequest):
    """Enhanced 자기소개서 생성 API (COT 스트리밍)
    
    채용공고 스크래핑 + 기업정보 검색 + 자기소개서 생성을 
    Chain of Thought 형태로 실시간 스트리밍합니다.
    
    SSE Event Types:
    - step_start: 단계 시작 {"step": "scraping", "message": "..."}
    - step_complete: 단계 완료 {"step": "scraping", "data": {...}}
    - thinking: AI 사고과정 {"message": "..."}
    - content: 생성 콘텐츠 {"chunk": "..."}
    - done: 완료 {"data": {...}}
    - error: 에러 {"message": "..."}
    """
    try:
        llm_adapter = get_llm_adapter(request.model_type)
        pipeline = EnhancedPipelineChain(llm_adapter)
        
        async def event_generator():
            try:
                async for event in pipeline.run_with_cot_stream(
                    question=request.question,
                    blocks=request.blocks,
                    company_name=request.company_name,
                    position=request.position,
                    poster_url=request.poster_url,
                    fallback_content=request.fallback_content,
                    char_limit=request.char_limit or 800,
                    references=request.references
                ):
                    yield event.to_sse()
                
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                import json
                error_payload = json.dumps({
                    "event": "error",
                    "message": str(e)
                }, ensure_ascii=False)
                yield f"data: {error_payload}\n\n"
        
        return StreamingResponse(event_generator(), media_type="text/event-stream")
        
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "message": f"초기화 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/cover-letters/generate/smart/stream")
async def generate_cover_letter_smart_stream(request: SmartGenerationRequest):
    """스마트 자기소개서 생성 API (블록/자소서 자동 선택 + COT 스트리밍)
    
    문항에 가장 적합한 블록과 기존 자소서를 LLM이 자동 선택하고,
    선택된 자료를 바탕으로 자기소개서를 생성합니다.
    
    SSE Event Types:
    - step_start: 단계 시작
    - step_complete: 단계 완료
    - thinking: AI 사고과정 (어떤 블록/자소서 선택했는지)
    - content: 생성 콘텐츠
    - selection: 선택된 자료 정보
    - done: 완료
    """
    try:
        import json
        import asyncio
        
        llm_adapter = get_llm_adapter(request.model_type)
        smart_chain = SmartGenerationChain(llm_adapter.llm)
        spring_client = SpringAPIClient()
        
        async def event_generator():
            try:
                blocks = request.blocks or []
                cover_letters = request.cover_letters or []
                
                # 블록/자소서가 제공되지 않으면 Spring API에서 가져오기
                if not blocks or not cover_letters:
                    # 1단계: 데이터 로딩
                    load_msg = json.dumps({
                        "event": "step_start",
                        "step": "loading",
                        "message": "📂 사용자 블록 및 자기소개서 데이터 로딩 중..."
                    }, ensure_ascii=False)
                    yield f"data: {load_msg}\n\n"
                    
                    if not blocks:
                        blocks = await spring_client.get_all_blocks(
                            request.user_id, request.auth_token
                        )
                    if not cover_letters:
                        cover_letters = await spring_client.get_all_cover_letters(
                            request.user_id, request.auth_token
                        )
                    
                    load_complete = json.dumps({
                        "event": "step_complete",
                        "step": "loading",
                        "data": {
                            "blocks_count": len(blocks),
                            "cover_letters_count": len(cover_letters)
                        }
                    }, ensure_ascii=False)
                    yield f"data: {load_complete}\n\n"
                
                # Enhanced 분석 (스크래핑 + 검색)
                job_analysis = request.job_analysis
                async for event_type, data in run_enhanced_analysis(
                    company_name=request.company_name,
                    position=request.position,
                    poster_url=request.poster_url,
                    fallback_content=request.fallback_content,
                    existing_job_analysis=request.job_analysis
                ):
                    if event_type == "job_analysis":
                        job_analysis = data
                    else:
                        event_msg = json.dumps({
                            "event": event_type,
                            **data
                        }, ensure_ascii=False)
                        yield f"data: {event_msg}\n\n"
                
                # 스마트 선택 및 생성
                select_msg = json.dumps({
                    "event": "step_start",
                    "step": "selecting",
                    "message": f"🧠 '{request.question[:30]}...' 문항에 적합한 경험 선택 중..."
                }, ensure_ascii=False)
                yield f"data: {select_msg}\n\n"
                
                await asyncio.sleep(0.3)
                
                # 생성 시작
                gen_msg = json.dumps({
                    "event": "step_start",
                    "step": "generating",
                    "message": "✍️ 선택된 경험을 바탕으로 자기소개서 작성 중..."
                }, ensure_ascii=False)
                yield f"data: {gen_msg}\n\n"
                
                # 스트리밍 생성
                full_response = ""
                async for chunk in smart_chain.stream(
                    question=request.question,
                    company_name=request.company_name,
                    position=request.position,
                    blocks=blocks,
                    cover_letters=cover_letters,
                    job_analysis=job_analysis,
                    char_limit=request.char_limit or 800
                ):
                    full_response += chunk
                    content_msg = json.dumps({
                        "event": "content",
                        "chunk": chunk
                    }, ensure_ascii=False)
                    yield f"data: {content_msg}\n\n"
                
                # 선택 정보 파싱 및 전송
                parsed = smart_chain._parse_response(full_response)
                selection_msg = json.dumps({
                    "event": "selection",
                    "data": {
                        "selected_blocks": parsed.get("selected_blocks", []),
                        "selected_cover_letters": parsed.get("selected_cover_letters", [])
                    }
                }, ensure_ascii=False)
                yield f"data: {selection_msg}\n\n"
                
                # 완료
                done_msg = json.dumps({
                    "event": "done",
                    "data": {"success": True}
                }, ensure_ascii=False)
                yield f"data: {done_msg}\n\n"
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                error_msg = json.dumps({
                    "event": "error",
                    "message": str(e)
                }, ensure_ascii=False)
                yield f"data: {error_msg}\n\n"
        
        return StreamingResponse(event_generator(), media_type="text/event-stream")
        
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "message": f"초기화 중 오류 발생: {str(e)}"
        })


@app.post("/api/ai/cover-letters/generate/selected/stream")
async def generate_cover_letter_selected_stream(request: SelectedGenerationRequest):
    """선택된 블록/자소서로 자기소개서 생성 (사용자 직접 선택 + 스트리밍)
    
    사용자가 직접 선택한 블록과 자소서만 사용하여 자기소개서를 생성합니다.
    block_ids, cover_letter_ids로 Spring API에서 데이터를 가져오거나,
    blocks, cover_letters로 직접 데이터를 전달할 수 있습니다.
    """
    try:
        import json
        
        llm_adapter = get_llm_adapter(request.model_type)
        spring_client = SpringAPIClient()
        
        async def event_generator():
            try:
                blocks = request.blocks or []
                cover_letters = request.cover_letters or []
                
                # ID로 데이터 가져오기
                if request.block_ids:
                    load_msg = json.dumps({
                        "event": "step_start",
                        "step": "loading",
                        "message": f"📂 선택한 블록 {len(request.block_ids)}개 로딩 중..."
                    }, ensure_ascii=False)
                    yield f"data: {load_msg}\n\n"
                    
                    fetched_blocks = await spring_client.get_blocks_by_ids(
                        request.block_ids, request.auth_token
                    )
                    blocks = fetched_blocks
                
                if request.cover_letter_ids:
                    load_msg = json.dumps({
                        "event": "step_start",
                        "step": "loading",
                        "message": f"📂 선택한 자소서 {len(request.cover_letter_ids)}개 로딩 중..."
                    }, ensure_ascii=False)
                    yield f"data: {load_msg}\n\n"
                    
                    fetched_cls = await spring_client.get_cover_letters_by_ids(
                        request.cover_letter_ids, request.auth_token
                    )
                    cover_letters = fetched_cls
                
                load_complete = json.dumps({
                    "event": "step_complete",
                    "step": "loading",
                    "data": {
                        "blocks_count": len(blocks),
                        "cover_letters_count": len(cover_letters)
                    }
                }, ensure_ascii=False)
                yield f"data: {load_complete}\n\n"
                
                # Enhanced 분석 (스크래핑 + 검색)
                job_analysis = request.job_analysis
                async for event_type, data in run_enhanced_analysis(
                    company_name=request.company_name,
                    position=request.position,
                    poster_url=getattr(request, 'poster_url', None),
                    fallback_content=getattr(request, 'fallback_content', None),
                    existing_job_analysis=request.job_analysis
                ):
                    if event_type == "job_analysis":
                        job_analysis = data
                    else:
                        event_msg = json.dumps({
                            "event": event_type,
                            **data
                        }, ensure_ascii=False)
                        yield f"data: {event_msg}\n\n"
                
                # 블록 내용을 문자열 리스트로 변환
                block_contents = []
                for b in blocks:
                    if isinstance(b, dict):
                        block_contents.append(b.get("content", str(b)))
                    else:
                        block_contents.append(str(b))
                
                # 참고 자소서 내용을 문자열 리스트로 변환
                reference_contents = []
                for cl in cover_letters:
                    if isinstance(cl, dict):
                        reference_contents.append(cl.get("content", str(cl)))
                    else:
                        reference_contents.append(str(cl))
                
                # 생성 시작
                gen_msg = json.dumps({
                    "event": "step_start",
                    "step": "generating",
                    "message": f"✍️ 선택한 {len(blocks)}개 블록과 {len(cover_letters)}개 참고자료로 작성 중..."
                }, ensure_ascii=False)
                yield f"data: {gen_msg}\n\n"
                
                # 스트리밍 생성
                async for chunk in llm_adapter.stream_cover_letter(
                    question=request.question,
                    blocks=block_contents,
                    references=reference_contents if reference_contents else None,
                    job_analysis=job_analysis,
                    char_limit=request.char_limit or 800,
                    company_name=request.company_name,
                    position=request.position
                ):
                    content_msg = json.dumps({
                        "event": "content",
                        "chunk": chunk
                    }, ensure_ascii=False)
                    yield f"data: {content_msg}\n\n"
                
                # 완료
                done_msg = json.dumps({
                    "event": "done",
                    "data": {
                        "success": True,
                        "blocks_used": len(blocks),
                        "references_used": len(cover_letters)
                    }
                }, ensure_ascii=False)
                yield f"data: {done_msg}\n\n"
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                error_msg = json.dumps({
                    "event": "error",
                    "message": str(e)
                }, ensure_ascii=False)
                yield f"data: {error_msg}\n\n"
        
        return StreamingResponse(event_generator(), media_type="text/event-stream")
        
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False, "message": f"초기화 중 오류 발생: {str(e)}"
        })



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_env == "development"
    )
