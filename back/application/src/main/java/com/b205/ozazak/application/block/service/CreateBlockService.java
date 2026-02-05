package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.command.CreateBlockCommand;
import com.b205.ozazak.application.block.port.in.CreateBlockUseCase;
import com.b205.ozazak.application.block.port.out.SaveBlockPort;
import com.b205.ozazak.application.block.port.out.BlockVectorPort;
import com.b205.ozazak.application.block.result.CreateBlockResult;
import com.b205.ozazak.application.essay.port.out.AIGenerationPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.block.entity.Block;
import com.b205.ozazak.domain.block.enums.SourceType;
import com.b205.ozazak.domain.block.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateBlockService implements CreateBlockUseCase {

    private final SaveBlockPort saveBlockPort;
    private final AIGenerationPort aiGenerationPort;
    private final BlockVectorPort blockVectorPort;

    @Override
    public CreateBlockResult execute(CreateBlockCommand command) {
        Block block = Block.builder()
                .account(Account.builder()
                        .id(new AccountId(command.getAccountId()))
                        .build())
                .title(new BlockTitle(command.getTitle()))
                .content(new BlockContent(command.getContent()))
                .categories(new Categories(command.getCategories()))  // 이미 Integer 코드
                .sourceType(SourceType.USER_GENERATED)
                .sourceTitle(null) // Manual creation has no source
                .build();

        Block saved = saveBlockPort.save(block);

        // Generate embedding for the manually created block
        String contentForEmbedding = saved.getTitle().value() + " " + saved.getContent().value();
        java.util.List<Double> embedding = aiGenerationPort.generateEmbedding(contentForEmbedding);
        String vectorStr = embedding.toString();

        // Update vector
        blockVectorPort.updateVector(saved.getId().value(), vectorStr);

        return CreateBlockResult.builder()
                .blockId(saved.getId().value())
                .build();
    }
}
