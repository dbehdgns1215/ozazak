package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.port.out.BlockVectorPort;
import com.b205.ozazak.application.block.port.out.SaveBlockPort;
import com.b205.ozazak.application.essay.port.out.AIGenerationPort;
import com.b205.ozazak.application.essay.port.out.AIGenerationPort.ExtractBlocksRequest;
import com.b205.ozazak.application.essay.port.out.AIGenerationPort.ExtractedBlock;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.block.entity.Block;
import com.b205.ozazak.domain.block.vo.BlockContent;
import com.b205.ozazak.domain.block.vo.BlockTitle;
import com.b205.ozazak.domain.block.vo.Categories;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 자소서에서 경험 블록을 추출하여 저장하는 서비스
 * FastAPI /api/ai/blocks/generate 엔드포인트 사용
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BlockExtractionService {

    private static final double SIMILARITY_THRESHOLD = 0.3; // Cosine distance threshold (0=identical, 0.3=very similar)

    private final AIGenerationPort aiGenerationPort;
    private final SaveBlockPort saveBlockPort;
    private final BlockVectorPort blockVectorPort;

    /**
     * 비동기로 자소서에서 블록을 추출하여 저장
     */
    @Async("aiGenerationExecutor")
    @Transactional
    public void extractAndSaveBlocksAsync(Long accountId, Long coverletterId, String coverletterTitle, List<String> essayContents) {
        try {
            log.info("Starting block extraction for account {}", accountId);

            // 1. FastAPI 호출 (카테고리는 FastAPI가 자체적으로 결정)
            List<ExtractedBlock> extracted = aiGenerationPort.extractBlocks(
                    ExtractBlocksRequest.builder()
                            .essayContents(essayContents)
                            .availableCategories(List.of())  // FastAPI가 자체적으로 카테고리 결정
                            .build()
            );

            if (extracted.isEmpty()) {
                log.info("No blocks extracted for account {}", accountId);
                return;
            }

            // 2. Block 엔티티로 변환 및 저장
            int savedCount = 0;
            for (ExtractedBlock eb : extracted) {
                // 2-1. 임베딩 벡터가 있으면 중복 체크
                if (eb.getEmbedding() != null && !eb.getEmbedding().isEmpty()) {
                    String vectorStr = eb.getEmbedding().toString();
                    
                    // 유사도 체크
                    var minDistance = blockVectorPort.findMinDistance(accountId, vectorStr);
                    if (minDistance.isPresent() && minDistance.get() < SIMILARITY_THRESHOLD) {
                        log.info("Skipping duplicate block (distance: {}): {}", minDistance.get(), eb.getTitle());
                        continue; // 중복 블록은 저장하지 않음
                    }
                }
                
                // 2-2. Block 생성 및 저장
                Block block = Block.builder()
                        .account(Account.builder().id(new AccountId(accountId)).build())
                        .title(new BlockTitle(eb.getTitle()))
                        .content(new BlockContent(eb.getContent()))
                        .categories(new Categories(eb.getCategories()))
                        .sourceType(com.b205.ozazak.domain.block.enums.SourceType.COVER_LETTER)
                        .sourceTitle(new com.b205.ozazak.domain.block.vo.SourceTitle(coverletterTitle))
                        .build();
                Block saved = saveBlockPort.save(block);
                
                // 2-3. 임베딩 벡터 저장 (FastAPI에서 제공)
                if (eb.getEmbedding() != null && !eb.getEmbedding().isEmpty()) {
                    String vectorStr = eb.getEmbedding().toString();
                    blockVectorPort.updateVector(saved.getId().value(), vectorStr);
                    log.debug("Stored embedding vector for block {}", saved.getId().value());
                }
                
                savedCount++;
            }

            log.info("Extracted {} blocks, saved {} blocks (skipped {} duplicates) for account {}", 
                    extracted.size(), savedCount, extracted.size() - savedCount, accountId);

        } catch (Exception e) {
            // 블록 추출 실패해도 자소서 생성은 성공해야 함
            log.error("Block extraction failed for account {}: {}", accountId, e.getMessage(), e);
        }
    }
}

