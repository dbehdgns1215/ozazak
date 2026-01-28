package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.command.GetBlockDetailCommand;
import com.b205.ozazak.application.block.port.in.GetBlockDetailUseCase;
import com.b205.ozazak.application.block.port.out.LoadBlockPort;
import com.b205.ozazak.application.block.result.BlockDetailResult;
import com.b205.ozazak.domain.block.entity.Block;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetBlockDetailService implements GetBlockDetailUseCase {

    private final LoadBlockPort loadBlockPort;

    @Override
    public BlockDetailResult execute(GetBlockDetailCommand command) {
        Block block = loadBlockPort.findById(command.getBlockId())
                .orElseThrow(() -> new IllegalArgumentException("Block not found: " + command.getBlockId()));

        // 소유권 검증
        Long ownerId = block.getAccount().getId().value();
        if (!ownerId.equals(command.getAccountId())) {
            throw new IllegalArgumentException("Access denied: Block does not belong to this account");
        }

        return BlockDetailResult.from(block);
    }
}
