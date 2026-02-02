package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.command.DeleteBlockCommand;
import com.b205.ozazak.application.block.port.in.DeleteBlockUseCase;
import com.b205.ozazak.application.block.port.out.DeleteBlockPort;
import com.b205.ozazak.application.block.port.out.LoadBlockPort;
import com.b205.ozazak.application.block.result.DeleteBlockResult;
import com.b205.ozazak.domain.block.entity.Block;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class DeleteBlockService implements DeleteBlockUseCase {

    private final LoadBlockPort loadBlockPort;
    private final DeleteBlockPort deleteBlockPort;

    @Override
    public DeleteBlockResult execute(DeleteBlockCommand command) {
        // 1. 블록 조회
        Block block = loadBlockPort.findById(command.getBlockId())
                .orElseThrow(() -> new IllegalArgumentException("Block not found: " + command.getBlockId()));

        // 2. 소유권 검증
        Long ownerId = block.getAccount().getId().value();
        if (!ownerId.equals(command.getAccountId())) {
            throw new IllegalArgumentException("Access denied: Block does not belong to this account");
        }

        // 3. Soft Delete
        deleteBlockPort.softDelete(command.getBlockId());

        return DeleteBlockResult.builder()
                .blockId(command.getBlockId())
                .deletedAt(LocalDateTime.now())
                .build();
    }
}
