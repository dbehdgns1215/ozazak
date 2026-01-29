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

import java.util.List;

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

        // 3. 카테고리 이름 → 코드 변환
        List<Integer> categoryCodes = BlockCategoryMapper.toCodes(command.getCategories());

        // 4. 업데이트된 블록 생성
        Block updated = Block.builder()
                .id(existing.getId())
                .account(existing.getAccount())
                .title(new BlockTitle(command.getTitle()))
                .content(new BlockContent(command.getContent()))
                .categories(new Categories(categoryCodes))
                .vector(existing.getVector())
                .deletedAt(existing.getDeletedAt())
                .build();

        // 5. 저장
        Block saved = saveBlockPort.save(updated);

        // 6. 코드 → 이름 변환하여 반환
        List<String> categoryNames = BlockCategoryMapper.toNames(saved.getCategories().value());

        return UpdateBlockResult.builder()
                .blockId(saved.getId().value())
                .title(saved.getTitle().value())
                .categories(categoryNames)
                .content(saved.getContent().value())
                .build();
    }
}
