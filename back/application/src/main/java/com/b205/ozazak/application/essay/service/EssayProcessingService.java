package com.b205.ozazak.application.essay.service;

import com.b205.ozazak.application.block.port.out.LoadBlockPort;
import com.b205.ozazak.application.block.service.BlockCategoryMapper;
import com.b205.ozazak.application.essay.command.AIGenerateEssayBatchCommand;
import com.b205.ozazak.application.essay.port.out.AIGenerationPort;
import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.application.essay.result.AIGenerateEssayBatchResult.EssayGenerationResult;
import com.b205.ozazak.domain.block.entity.Block;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.coverletter.vo.CoverletterId;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.*;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.question.vo.QuestionId;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * 개별 Essay AI 생성 처리 (비동기 + 개별 트랜잭션)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EssayProcessingService {

    private final AIGenerationPort aiGenerationPort;
    private final LoadEssayPort loadEssayPort;
    private final SaveEssayPort saveEssayPort;
    private final LoadBlockPort loadBlockPort;

    @Async("aiGenerationExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public CompletableFuture<EssayGenerationResult> processAsync(
            AIGenerationContext context,
            AIGenerationContext.EssayData essayData,
            AIGenerateEssayBatchCommand.EssayGenerationItem item,
            Long accountId
    ) {
        try {
            log.info("Processing essay {} in thread {}", essayData.getEssayId(), Thread.currentThread().getName());

            // 1. 참조 Block 조회
            List<AIGenerationPort.ReferenceBlock> referenceBlocks = loadReferenceBlocks(item.getReferenceBlockIds());

            // 2. FastAPI 호출
            AIGenerationPort.AIGenerationRequest request = AIGenerationPort.AIGenerationRequest.builder()
                    .company(context.getCompany())
                    .recruitmentTitle(context.getRecruitmentTitle())
                    .position(context.getPosition())
                    .question(essayData.getQuestionContent())
                    .referenceEssays(context.getReferenceEssays().stream()
                            .map(e -> AIGenerationPort.ReferenceEssay.builder()
                                    .question(e.getQuestion())
                                    .content(e.getContent())
                                    .build())
                            .collect(Collectors.toList()))
                    .referenceBlocks(referenceBlocks)
                    .userPrompt(item.getUserPrompt())
                    .recruitmentAnalysis(context.getRecruitmentAnalysis())  // 공고 분석 결과 포함
                    .build();

            String aiContent = aiGenerationPort.generate(request);

            // 3. 조건부 버전 처리
            EssayGenerationResult result = processVersioning(essayData, item.getEssayContent(), aiContent);

            log.info("Essay {} processed successfully", essayData.getEssayId());
            return CompletableFuture.completedFuture(result);

        } catch (Exception e) {
            log.error("Essay {} processing failed: {}", essayData.getEssayId(), e.getMessage());
            return CompletableFuture.completedFuture(
                    EssayGenerationResult.failed(
                            essayData.getEssayId(),
                            essayData.getQuestionId(),
                            essayData.getQuestionContent(),
                            e.getMessage()
                    )
            );
        }
    }

    private List<AIGenerationPort.ReferenceBlock> loadReferenceBlocks(List<Long> blockIds) {
        if (blockIds == null || blockIds.isEmpty()) {
            return List.of();
        }

        return blockIds.stream()
                .map(loadBlockPort::findById)
                .filter(opt -> opt.isPresent())
                .map(opt -> opt.get())
                .map(block -> AIGenerationPort.ReferenceBlock.builder()
                        .title(block.getTitle().value())
                        .content(block.getContent().value())
                        .categories(block.getCategories() != null
                                ? BlockCategoryMapper.toNames(block.getCategories().value())
                                : List.of())
                        .build())
                .collect(Collectors.toList());
    }

    private EssayGenerationResult processVersioning(
            AIGenerationContext.EssayData essayData,
            String currentContent,
            String aiContent
    ) {
        boolean isEmpty = currentContent == null || currentContent.trim().isEmpty();

        if (isEmpty) {
            // Case 1: 덮어씌우기 (UPDATE)
            Essay currentEssay = loadEssayPort.findById(essayData.getEssayId())
                    .orElseThrow(() -> new IllegalArgumentException("Essay not found: " + essayData.getEssayId()));

            Essay updated = Essay.builder()
                    .id(currentEssay.getId())
                    .coverletter(currentEssay.getCoverletter())
                    .question(currentEssay.getQuestion())
                    .content(new EssayContent(aiContent))
                    .version(currentEssay.getVersion())
                    .versionTitle(new VersionTitle("AI 생성"))
                    .isCurrent(currentEssay.getIsCurrent())
                    .build();

            saveEssayPort.save(updated);

            return EssayGenerationResult.success(
                    essayData.getEssayId(),
                    essayData.getQuestionId(),
                    essayData.getQuestionContent(),
                    aiContent,
                    essayData.getCurrentVersion(),
                    "AI 생성",
                    false  // isNewVersion = false (덮어씌우기)
            );
        } else {
            // Case 2: 새 버전 생성
            Essay currentEssay = loadEssayPort.findById(essayData.getEssayId())
                    .orElseThrow(() -> new IllegalArgumentException("Essay not found: " + essayData.getEssayId()));

            // 기존 essay의 isCurrent를 false로 변경
            Essay updatedCurrent = Essay.builder()
                    .id(currentEssay.getId())
                    .coverletter(currentEssay.getCoverletter())
                    .question(currentEssay.getQuestion())
                    .content(currentEssay.getContent())
                    .version(currentEssay.getVersion())
                    .versionTitle(currentEssay.getVersionTitle())
                    .isCurrent(new IsCurrent(false))
                    .build();
            saveEssayPort.save(updatedCurrent);

            // 새 버전 생성
            int newVersion = essayData.getCurrentVersion() + 1;
            Essay newEssay = Essay.builder()
                    .coverletter(currentEssay.getCoverletter())
                    .question(currentEssay.getQuestion())
                    .content(new EssayContent(aiContent))
                    .version(new Version(newVersion))
                    .versionTitle(new VersionTitle("AI 생성"))
                    .isCurrent(new IsCurrent(true))
                    .build();

            Essay saved = saveEssayPort.save(newEssay);

            return EssayGenerationResult.success(
                    saved.getId().value(),
                    essayData.getQuestionId(),
                    essayData.getQuestionContent(),
                    aiContent,
                    newVersion,
                    "AI 생성",
                    true  // isNewVersion = true
            );
        }
    }
}
