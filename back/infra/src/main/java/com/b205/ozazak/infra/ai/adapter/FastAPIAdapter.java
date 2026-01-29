package com.b205.ozazak.infra.ai.adapter;

import com.b205.ozazak.application.essay.port.out.AIGenerationPort;
import com.b205.ozazak.infra.ai.dto.FastAPIAnalyzeRequest;
import com.b205.ozazak.infra.ai.dto.FastAPIGenerateRequest;
import com.b205.ozazak.infra.ai.dto.FastAPIGenerateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

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
                    .uri("/generate")
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
                .companyName(request.getCompanyName())
                .recruitmentTitle(request.getRecruitmentTitle())
                .recruitmentContent(request.getRecruitmentContent())
                .questions(request.getQuestions())
                .build();

        try {
            Map<String, Object> response = fastApiWebClient.post()
                    .uri("/analyze")
                    .bodyValue(fastApiRequest)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (response == null) {
                throw new RuntimeException("FastAPI analyze returned null response");
            }

            log.info("FastAPI analyze completed successfully");
            return response;

        } catch (WebClientResponseException e) {
            log.error("FastAPI analyze failed: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("공고 분석 실패: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("FastAPI analyze failed: {}", e.getMessage());
            throw new RuntimeException("공고 분석 실패: " + e.getMessage(), e);
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
                .recruitmentAnalysis(request.getRecruitmentAnalysis())  // 분석 결과 포함
                .build();
    }
}
