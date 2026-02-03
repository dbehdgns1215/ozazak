package com.b205.ozazak.infra.ai.adapter;

import com.b205.ozazak.application.essay.port.out.AIGenerationPort;
import com.b205.ozazak.infra.ai.dto.FastAPIAnalyzeRequest;
import com.b205.ozazak.infra.ai.dto.FastAPIExtractBlocksRequest;
import com.b205.ozazak.infra.ai.dto.FastAPIExtractBlocksResponse;
import com.b205.ozazak.infra.ai.dto.FastAPIGenerateRequest;
import com.b205.ozazak.infra.ai.dto.FastAPIGenerateResponse;
import com.b205.ozazak.application.block.service.BlockCategoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class FastAPIAdapter implements AIGenerationPort {

    private final WebClient fastApiWebClient;

    @Override
    public String generate(AIGenerationRequest request) {
        FastAPIGenerateRequest fastApiRequest = toFastAPIRequest(request);

        try {
            FastAPIGenerateResponse response = fastApiWebClient.post()
                    .uri("/api/ai/cover-letters/selected")  // 실제 FastAPI 엔드포인트
                    .bodyValue(fastApiRequest)
                    .retrieve()
                    .bodyToMono(FastAPIGenerateResponse.class)
                    .block();

            if (response == null) {
                throw new RuntimeException("FastAPI returned null response");
            }

            if (response.getError() != null && !response.getError().isEmpty()) {
                throw new RuntimeException("FastAPI error: " + response.getError());
            }

            return response.getContent();

        } catch (WebClientResponseException e) {
            log.error("FastAPI call failed: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI 생성 실패: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("FastAPI call failed: {}", e.getMessage());
            throw new RuntimeException("AI 생성 실패: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> analyze(RecruitmentAnalysisRequest request) {
        FastAPIAnalyzeRequest fastApiRequest = FastAPIAnalyzeRequest.builder()
                .userId("system")  // 시스템 호출용 기본값
                .companyName(request.getCompanyName())
                .position(request.getRecruitmentTitle())  // recruitmentTitle → position
                .jobPosting(request.getRecruitmentContent())  // recruitmentContent → job_posting
                .requirements(null)
                .modelType(null)
                .build();

        try {
            Map<String, Object> response = fastApiWebClient.post()
                    .uri("/api/ai/job-postings/analyze")  // 실제 FastAPI 엔드포인트
                    .bodyValue(fastApiRequest)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (response == null) {
                throw new RuntimeException("FastAPI analyze returned null response");
            }

            // FastAPI returns { success, analysis, message, model_used }
            @SuppressWarnings("unchecked")
            Map<String, Object> analysis = (Map<String, Object>) response.get("analysis");
            if (analysis == null) {
                log.warn("FastAPI analyze returned null analysis, using full response");
                return response;
            }

            log.info("FastAPI analyze completed successfully");
            return analysis;

        } catch (WebClientResponseException e) {
            log.error("FastAPI analyze failed: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("공고 분석 실패: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("FastAPI analyze failed: {}", e.getMessage());
            throw new RuntimeException("공고 분석 실패: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ExtractedBlock> extractBlocks(ExtractBlocksRequest request) {
        // 자소서 내용들을 하나로 합쳐서 source_content로 전달
        String combinedContent = String.join("\n\n---\n\n", request.getEssayContents());

        FastAPIExtractBlocksRequest fastApiRequest = FastAPIExtractBlocksRequest.builder()
                .userId("system")
                .sourceType("cover_letter")  // 자소서에서 추출
                .sourceContent(combinedContent)
                .modelType(null)
                .build();

        try {
            FastAPIExtractBlocksResponse response = fastApiWebClient.post()
                    .uri("/api/ai/blocks/generate")  // 실제 FastAPI 엔드포인트
                    .bodyValue(fastApiRequest)
                    .retrieve()
                    .bodyToMono(FastAPIExtractBlocksResponse.class)
                    .block();

            if (response == null || !response.isSuccess()) {
                log.warn("FastAPI blocks/generate returned null or failed response");
                return List.of();
            }

            if (response.getBlocks() == null || response.getBlocks().isEmpty()) {
                log.info("FastAPI blocks/generate returned empty blocks");
                return List.of();
            }

            log.info("FastAPI blocks/generate completed: {} blocks extracted", response.getBlocks().size());

            return response.getBlocks().stream()
                    .map(block -> ExtractedBlock.builder()
                            .title(block.getCategory())  // category를 title로 사용
                            .content(block.getContent())
                            .categories(List.of(BlockCategoryMapper.toCode(block.getCategory()))
                                    .stream().filter(c -> c != null).toList())
                            .build())
                    .collect(Collectors.toList());

        } catch (WebClientResponseException e) {
            log.error("FastAPI blocks/generate failed: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("블록 추출 실패: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("FastAPI blocks/generate failed: {}", e.getMessage());
            throw new RuntimeException("블록 추출 실패: " + e.getMessage(), e);
        }
    }

    private FastAPIGenerateRequest toFastAPIRequest(AIGenerationRequest request) {
        return FastAPIGenerateRequest.builder()
                .company(request.getCompany())
                .recruitmentTitle(request.getRecruitmentTitle())
                .question(request.getQuestion())
                .referenceEssays(request.getReferenceEssays() != null
                        ? request.getReferenceEssays().stream()
                            .map(e -> FastAPIGenerateRequest.ReferenceEssayDto.builder()
                                    .question(e.getQuestion())
                                    .content(e.getContent())
                                    .build())
                            .collect(Collectors.toList())
                        : null)
                .referenceBlocks(request.getReferenceBlocks() != null
                        ? request.getReferenceBlocks().stream()
                            .map(b -> FastAPIGenerateRequest.ReferenceBlockDto.builder()
                                    .title(b.getTitle())
                                    .content(b.getContent())
                                    .categories(b.getCategories())
                                    .build())
                            .collect(Collectors.toList())
                        : null)
                .userPrompt(request.getUserPrompt())
                .recruitmentAnalysis(request.getRecruitmentAnalysis())
                .build();
    }

    // ============ Block Generation ============

    @Override
    public List<BlockGenerationResult> generateBlocks(BlockGenerationRequest request) {
        com.b205.ozazak.infra.ai.dto.FastAPIBlockGenerationRequest fastApiRequest = 
                com.b205.ozazak.infra.ai.dto.FastAPIBlockGenerationRequest.builder()
                .userId("system")
                .sourceType(request.getSourceType())
                .sourceContent(request.getSourceContent())
                .build();

        try {
            com.b205.ozazak.infra.ai.dto.FastAPIBlockGenerationResponse response = fastApiWebClient.post()
                    .uri("/api/ai/blocks/generate")
                    .bodyValue(fastApiRequest)
                    .retrieve()
                    .bodyToMono(com.b205.ozazak.infra.ai.dto.FastAPIBlockGenerationResponse.class)
                    .block();

            if (response == null || response.getBlocks() == null) {
                return List.of();
            }

            return response.getBlocks().stream()
                    .map(block -> BlockGenerationResult.builder()
                            .category(block.getCategory())
                            .content(block.getContent())
                            .keywords(block.getKeywords())
                            .embedding(block.getEmbedding())
                            .build())
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Block generation failed: {}", e.getMessage());
            throw new RuntimeException("블록 생성 실패", e);
        }
    }

    @Override
    public List<Double> generateEmbedding(String text) {
        com.b205.ozazak.infra.ai.dto.FastAPIEmbeddingRequest request = 
                com.b205.ozazak.infra.ai.dto.FastAPIEmbeddingRequest.builder()
                .text(text)
                .build();

        try {
            com.b205.ozazak.infra.ai.dto.FastAPIEmbeddingResponse response = fastApiWebClient.post()
                    .uri("/api/ai/embeddings")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(com.b205.ozazak.infra.ai.dto.FastAPIEmbeddingResponse.class)
                    .block();

            if (response == null || !response.isSuccess()) {
                throw new RuntimeException("Embedding API returned failure");
            }

            return response.getEmbedding();

        } catch (Exception e) {
            log.error("Embedding generation failed: {}", e.getMessage());
            throw new RuntimeException("임베딩 생성 실패", e);
        }
    }
}


