package com.b205.ozazak.application.essay.service;

import com.b205.ozazak.application.aicache.port.out.LoadAnalysisCachePort;
import com.b205.ozazak.application.aicache.port.out.SaveAnalysisCachePort;
import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
import com.b205.ozazak.application.essay.command.AIGenerateEssayBatchCommand;
import com.b205.ozazak.application.essay.port.in.AIGenerateEssayBatchUseCase;
import com.b205.ozazak.application.essay.port.out.AIGenerationPort;
import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.result.AIGenerateEssayBatchResult;
import com.b205.ozazak.application.essay.result.AIGenerateEssayBatchResult.EssayGenerationResult;
import com.b205.ozazak.application.recruitment.port.out.LoadRecruitmentPort;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * AI Essay 일괄 생성 서비스 (전체 흐름 관리)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIGenerateEssayBatchService implements AIGenerateEssayBatchUseCase {

    private final EssayProcessingService essayProcessingService;
    private final LoadRecruitmentPort loadRecruitmentPort;
    private final LoadCoverletterPort loadCoverletterPort;
    private final LoadEssayPort loadEssayPort;
    private final LoadAnalysisCachePort loadAnalysisCachePort;
    private final SaveAnalysisCachePort saveAnalysisCachePort;
    private final AIGenerationPort aiGenerationPort;

    private static final int TIMEOUT_SECONDS = 180;

    @Override
    @Transactional(readOnly = true) // 읽기 전용: 컨텍스트 데이터 수집만
    public AIGenerateEssayBatchResult execute(AIGenerateEssayBatchCommand command) {
        log.info("Starting AI batch generation for {} essays", command.getEssays().size());

        // 1. 공통 컨텍스트 데이터 수집 (Lazy Loading 방지)
        AIGenerationContext context = buildContext(command);

        // 2. 각 Essay의 데이터 수집
        Map<Long, AIGenerationContext.EssayData> essayDataMap = buildEssayDataMap(command);

        // 3. 병렬 처리 시작
        List<CompletableFuture<EssayGenerationResult>> futures = command.getEssays().stream()
                .map(item -> {
                    AIGenerationContext.EssayData essayData = essayDataMap.get(item.getEssayId());
                    if (essayData == null) {
                        // Essay를 찾을 수 없는 경우 즉시 실패 처리
                        return CompletableFuture.completedFuture(
                                EssayGenerationResult.failed(item.getEssayId(), null, null, "Essay not found"));
                    }
                    return essayProcessingService.processAsync(context, essayData, item, command.getAccountId());
                })
                .collect(Collectors.toList());

        // 4. 모든 결과 수집 (타임아웃 적용)
        List<EssayGenerationResult> results = futures.stream()
                .map(future -> {
                    try {
                        return future.get(TIMEOUT_SECONDS, TimeUnit.SECONDS);
                    } catch (Exception e) {
                        log.error("Future execution failed: {}", e.getMessage());
                        return EssayGenerationResult.failed(null, null, null, "타임아웃 또는 처리 오류: " + e.getMessage());
                    }
                })
                .collect(Collectors.toList());

        // 5. Summary 계산
        AIGenerateEssayBatchResult.Summary summary = AIGenerateEssayBatchResult.Summary.from(results);

        log.info("AI batch generation completed: {} success, {} failed",
                summary.getSuccessCount(), summary.getFailedCount());

        return AIGenerateEssayBatchResult.builder()
                .results(results)
                .summary(summary)
                .build();
    }

    private AIGenerationContext buildContext(AIGenerateEssayBatchCommand command) {
        // Recruitment 정보 조회
        Recruitment recruitment = loadRecruitmentPort.loadRecruitment(command.getRecruitmentId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Recruitment not found: " + command.getRecruitmentId()));

        String company = recruitment.getCompany() != null ? recruitment.getCompany().getName().value() : "Unknown";
        String recruitmentTitle = recruitment.getTitle() != null ? recruitment.getTitle().value() : "Unknown";
        String position = recruitment.getPosition(); // 직무 (nullable)
        // [FIX] Extract URL from recruitment
        String recruitmentUrl = recruitment.getApplyUrl() != null ? recruitment.getApplyUrl().value() : null;
        String recruitmentContent = recruitment.getContent() != null ? recruitment.getContent().value() : "";

        // 질문 목록 추출
        List<String> questions = extractQuestions(recruitment);

        // Redis 캐시 조회 또는 FastAPI 분석 요청
        Map<String, Object> recruitmentAnalysis = getOrFetchRecruitmentAnalysis(
                company, recruitmentTitle, recruitmentContent, questions, recruitment);

        // Reference Coverletters에서 Essay 수집
        List<AIGenerationContext.ReferenceEssayData> referenceEssays = new ArrayList<>();
        if (command.getReferenceCoverletterIds() != null) {
            for (Long coverletterId : command.getReferenceCoverletterIds()) {
                List<Essay> essays = loadEssayPort.findAllByCoverletterId(coverletterId);
                for (Essay essay : essays) {
                    if (essay.getContent() != null && essay.getContent().value() != null
                            && !essay.getContent().value().trim().isEmpty()) {
                        referenceEssays.add(AIGenerationContext.ReferenceEssayData.builder()
                                .question(essay.getQuestion() != null && essay.getQuestion().getContent() != null
                                        ? essay.getQuestion().getContent().value()
                                        : "")
                                .content(essay.getContent().value())
                                .build());
                    }
                }
            }
        }

        return AIGenerationContext.builder()
                .company(company)
                .recruitmentTitle(recruitmentTitle)
                .position(position)
                .recruitmentUrl(recruitmentUrl) // Added URL
                .recruitmentContent(recruitmentContent)
                .referenceEssays(referenceEssays)
                .recruitmentAnalysis(recruitmentAnalysis)
                .build();
    }

    private List<String> extractQuestions(Recruitment recruitment) {
        if (recruitment.getQuestions() == null) {
            return List.of();
        }
        return recruitment.getQuestions().stream()
                .map(q -> q.getContent() != null ? q.getContent().value() : "")
                .filter(content -> !content.isEmpty())
                .collect(Collectors.toList());
    }

    private Map<String, Object> getOrFetchRecruitmentAnalysis(
            String company, String recruitmentTitle, String recruitmentContent,
            List<String> questions, Recruitment recruitment) {

        String cacheKey = generateCacheKey(company, recruitmentTitle, recruitmentContent);
        log.info("Checking cache for key: {}", cacheKey);

        // 1. Redis 캐시 조회
        Optional<Map<String, Object>> cached = loadAnalysisCachePort.findByKey(cacheKey);

        if (cached.isPresent()) {
            log.info("Cache HIT for recruitment analysis");
            return cached.get();
        }

        // 2. 캐시 MISS → FastAPI 분석 요청
        log.info("Cache MISS, requesting FastAPI analysis");
        Map<String, Object> analysis = aiGenerationPort.analyze(
                AIGenerationPort.RecruitmentAnalysisRequest.builder()
                        .companyName(company)
                        .recruitmentTitle(recruitmentTitle)
                        .recruitmentContent(recruitmentContent)
                        .questions(questions)
                        .build());

        // 3. Redis에 저장
        Duration ttl = calculateTTL(recruitment);
        saveAnalysisCachePort.save(cacheKey, analysis, ttl);
        log.info("Analysis saved to cache with TTL: {} seconds", ttl.getSeconds());

        return analysis;
    }

    private String generateCacheKey(String companyName, String recruitmentTitle, String recruitmentContent) {
        String rawKey = (companyName.trim() + recruitmentTitle.trim() + recruitmentContent.trim());
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(rawKey.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return "job_analysis:" + sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }

    private Duration calculateTTL(Recruitment recruitment) {
        LocalDateTime endedAt = recruitment.getEndedAt() != null ? recruitment.getEndedAt().value() : null;
        LocalDateTime startedAt = recruitment.getStartedAt() != null ? recruitment.getStartedAt().value() : null;

        // 상시 채용 (시작일/마감일 모두 null)
        if (startedAt == null && endedAt == null) {
            return Duration.ofDays(14);
        }

        // 마감일 있으면 마감일까지
        if (endedAt != null) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime deadline = endedAt;
            long seconds = ChronoUnit.SECONDS.between(now, deadline);
            if (seconds > 0) {
                return Duration.ofSeconds(seconds);
            }
        }

        // 기본 7일
        return Duration.ofDays(7);
    }

    private Map<Long, AIGenerationContext.EssayData> buildEssayDataMap(AIGenerateEssayBatchCommand command) {
        Map<Long, AIGenerationContext.EssayData> map = new HashMap<>();

        for (AIGenerateEssayBatchCommand.EssayGenerationItem item : command.getEssays()) {
            loadEssayPort.findById(item.getEssayId()).ifPresent(essay -> {
                // 소유권 검증
                Long essayAccountId = essay.getCoverletter() != null
                        && essay.getCoverletter().getAccount() != null
                        && essay.getCoverletter().getAccount().getId() != null
                                ? essay.getCoverletter().getAccount().getId().value()
                                : null;

                if (!command.getAccountId().equals(essayAccountId)) {
                    log.warn("Essay {} does not belong to account {}", item.getEssayId(), command.getAccountId());
                    return; // 소유권 불일치 - skip
                }

                map.put(item.getEssayId(), AIGenerationContext.EssayData.builder()
                        .essayId(essay.getId().value())
                        .questionId(essay.getQuestion() != null && essay.getQuestion().getId() != null
                                ? essay.getQuestion().getId().value()
                                : null)
                        .questionContent(item.getQuestion() != null && !item.getQuestion().trim().isEmpty()
                                ? item.getQuestion()
                                : (essay.getQuestion() != null && essay.getQuestion().getContent() != null
                                        ? essay.getQuestion().getContent().value()
                                        : ""))
                        .coverletterId(essay.getCoverletter() != null && essay.getCoverletter().getId() != null
                                ? essay.getCoverletter().getId().value()
                                : null)
                        .accountId(essayAccountId)
                        .currentVersion(essay.getVersion() != null ? essay.getVersion().value() : 1)
                        .charMax(essay.getQuestion() != null
                                && essay.getQuestion().getCharMax() != null
                                        ? essay.getQuestion().getCharMax().value()
                                        : 800)
                        .build());
            });
        }

        return map;
    }
}
