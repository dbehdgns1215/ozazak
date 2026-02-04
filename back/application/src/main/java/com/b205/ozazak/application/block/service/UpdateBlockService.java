package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.command.UpdateBlockCommand;
import com.b205.ozazak.application.block.port.in.UpdateBlockUseCase;
import com.b205.ozazak.application.block.port.out.LoadBlockPort;
import com.b205.ozazak.application.block.port.out.SaveBlockPort;
import com.b205.ozazak.application.block.result.UpdateBlockResult;
import com.b205.ozazak.domain.block.entity.Block;
import com.b205.ozazak.domain.block.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateBlockService implements UpdateBlockUseCase {

    private final LoadBlockPort loadBlockPort;
    private final SaveBlockPort saveBlockPort;

    @Override
    public UpdateBlockResult execute(UpdateBlockCommand command) {
        // 1. 기존 블록 조회
        Block existing = loadBlockPort.findById(command.getBlockId())
                .orElseThrow(() -> new IllegalArgumentException("Block not found: " + command.getBlockId()));

        // 2. 소유권 검증
        Long ownerId = existing.getAccount().getId().value();
        if (!ownerId.equals(command.getAccountId())) {
            throw new IllegalArgumentException("Access denied: Block does not belong to this account");
        }

        // 3. 업데이트된 블록 생성
        Block updated = Block.builder()
                .id(existing.getId())
                .account(existing.getAccount())
                .title(new BlockTitle(command.getTitle()))
                .content(new BlockContent(command.getContent()))
                .categories(new Categories(command.getCategories()))  // 이미 Integer 코드
                .sourceType(existing.getSourceType())
                .sourceTitle(existing.getSourceTitle())
                .deletedAt(existing.getDeletedAt())
                .build();

        // 4. 저장
        Block saved = saveBlockPort.save(updated);

        return UpdateBlockResult.builder()
                .blockId(saved.getId().value())
                .title(saved.getTitle().value())
                .categories(saved.getCategories().value())  // Integer 코드 그대로 반환
                .content(saved.getContent().value())
                .build();
    }
}
