package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.command.GenerateBlocksFromCommunityCommand;
import com.b205.ozazak.application.block.port.in.GenerateBlocksFromCommunityUseCase;
import com.b205.ozazak.application.block.port.out.SaveBlockPort;
import com.b205.ozazak.application.block.port.out.BlockVectorPort;
import com.b205.ozazak.application.block.result.BlockDetailResult;
import com.b205.ozazak.application.block.result.GenerateBlocksResult;
import com.b205.ozazak.application.community.port.out.LoadCommunityPort;
import com.b205.ozazak.application.essay.port.out.AIGenerationPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.block.entity.Block;
import com.b205.ozazak.domain.block.enums.SourceType;
import com.b205.ozazak.domain.block.vo.*;
import com.b205.ozazak.domain.community.entity.Community;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GenerateBlocksFromCommunityService implements GenerateBlocksFromCommunityUseCase {

    private static final double SIMILARITY_THRESHOLD = 0.3; // Cosine distance threshold (0=identical, 0.3=very similar)

    private final LoadCommunityPort loadCommunityPort;
    private final AIGenerationPort aiGenerationPort;
    private final SaveBlockPort saveBlockPort;
    private final BlockVectorPort blockVectorPort;

    @Override
    @Transactional
    public GenerateBlocksResult execute(GenerateBlocksFromCommunityCommand command) {
        // 1. Load community and validate ownership
        Community community = loadCommunityPort.loadCommunity(command.getCommunityId())
                .orElseThrow(() -> new IllegalArgumentException("TIL을 찾을 수 없습니다: " + command.getCommunityId()));

        if (!community.getAuthor().getId().value().equals(command.getAccountId())) {
            throw new IllegalArgumentException("TIL에 대한 권한이 없습니다");
        }

        // 2. Generate blocks with embeddings (FastAPI handles embedding generation)
        String sourceContent = community.getTitle().value() + "\n" + community.getContent().value();
        AIGenerationPort.BlockGenerationRequest generationRequest = AIGenerationPort.BlockGenerationRequest.builder()
                .sourceType("til")
                .sourceContent(sourceContent)
                .build();

        List<AIGenerationPort.BlockGenerationResult> generatedBlocks = aiGenerationPort.generateBlocks(generationRequest);

        List<BlockDetailResult> savedBlocks = new ArrayList<>();

        // 3. For each generated block: check duplication and save
        for (AIGenerationPort.BlockGenerationResult generated : generatedBlocks) {
            // Convert embedding to vector string format: "[0.1,0.2,...]"
            String vectorStr = generated.getEmbedding().toString();

            // Check for duplicates
            Optional<Double> minDistance = blockVectorPort.findMinDistance(command.getAccountId(), vectorStr);

            if (minDistance.isPresent() && minDistance.get() < SIMILARITY_THRESHOLD) {
                log.info("Skipping duplicate block (distance: {}): {}", minDistance.get(), generated.getContent());
                continue; // Skip this duplicate
            }

            // Convert category string to code
            Integer categoryCode = BlockCategoryMapper.toCode(generated.getCategory());

            // Create and save block
            Block block = Block.builder()
                    .account(Account.builder().id(new AccountId(command.getAccountId())).build())
                    .title(new BlockTitle(community.getTitle().value())) // Use TIL title as block title
                    .content(new BlockContent(generated.getContent()))
                    .categories(new Categories(List.of(categoryCode)))
                    .sourceType(SourceType.TIL)
                    .sourceTitle(new SourceTitle(community.getTitle().value()))  // Save TIL title
                    .deletedAt(null)
                    .build();

            Block saved = saveBlockPort.save(block);

            // Update vector using native query
            blockVectorPort.updateVector(saved.getId().value(), vectorStr);

            savedBlocks.add(BlockDetailResult.from(saved));
        }

        return GenerateBlocksResult.builder()
                .blocks(savedBlocks)
                .build();
    }
}
