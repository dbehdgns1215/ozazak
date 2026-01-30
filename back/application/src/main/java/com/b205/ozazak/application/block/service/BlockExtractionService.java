package com.b205.ozazak.application.block.service;

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

    private final AIGenerationPort aiGenerationPort;
    private final SaveBlockPort saveBlockPort;

    /**
     * 비동기로 자소서에서 블록을 추출하여 저장
     */
    @Async("aiGenerationExecutor")
    @Transactional
    public void extractAndSaveBlocksAsync(Long accountId, List<String> essayContents) {
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
            for (ExtractedBlock eb : extracted) {
                Block block = Block.builder()
                        .account(Account.builder().id(new AccountId(accountId)).build())
                        .title(new BlockTitle(eb.getTitle()))
                        .content(new BlockContent(eb.getContent()))
                        .categories(new Categories(eb.getCategories()))
                        .build();
                saveBlockPort.save(block);
            }

            log.info("Extracted and saved {} blocks for account {}", extracted.size(), accountId);

        } catch (Exception e) {
            // 블록 추출 실패해도 자소서 생성은 성공해야 함
            log.error("Block extraction failed for account {}: {}", accountId, e.getMessage(), e);
        }
    }
}

