package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.command.GenerateBlocksFromProjectCommand;
import com.b205.ozazak.application.block.port.in.GenerateBlocksFromProjectUseCase;
import com.b205.ozazak.application.block.port.out.SaveBlockPort;
import com.b205.ozazak.application.block.port.out.BlockVectorPort;
import com.b205.ozazak.application.block.result.BlockDetailResult;
import com.b205.ozazak.application.block.result.GenerateBlocksResult;
import com.b205.ozazak.application.essay.port.out.AIGenerationPort;
import com.b205.ozazak.application.project.port.out.LoadProjectPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.block.entity.Block;
import com.b205.ozazak.domain.block.enums.SourceType;
import com.b205.ozazak.domain.block.vo.*;
import com.b205.ozazak.domain.project.entity.Project;
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
public class GenerateBlocksFromProjectService implements GenerateBlocksFromProjectUseCase {

    private static final double SIMILARITY_THRESHOLD = 0.3; // Cosine distance threshold (0=identical, 0.3=very similar)

    private final LoadProjectPort loadProjectPort;
    private final AIGenerationPort aiGenerationPort;
    private final SaveBlockPort saveBlockPort;
    private final BlockVectorPort blockVectorPort;

    @Override
    @Transactional
    public GenerateBlocksResult execute(GenerateBlocksFromProjectCommand command) {
        // 1. Load project and validate ownership
        Project project = loadProjectPort.loadProject(command.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다: " + command.getProjectId()));

        if (!project.getAuthor().getId().value().equals(command.getAccountId())) {
            throw new IllegalArgumentException("프로젝트에 대한 권한이 없습니다");
        }

        // 2. Generate blocks with embeddings (FastAPI handles embedding generation)
        String sourceContent = project.getTitle().value() + "\n" + project.getContent().value();
        AIGenerationPort.BlockGenerationRequest generationRequest = AIGenerationPort.BlockGenerationRequest.builder()
                .sourceType("project")
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
                    .title(new BlockTitle(project.getTitle().value())) // Use project title as block title
                    .content(new BlockContent(generated.getContent()))
                    .categories(new Categories(List.of(categoryCode)))
                    .sourceType(SourceType.PROJECT)
                    .sourceTitle(new SourceTitle(project.getTitle().value()))  // Save project title
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
