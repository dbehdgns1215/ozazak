package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.command.GetBlockListCommand;
import com.b205.ozazak.application.block.port.in.GetBlockListUseCase;
import com.b205.ozazak.application.block.port.out.LoadBlockPort;
import com.b205.ozazak.application.block.result.BlockListResult;
import com.b205.ozazak.domain.block.entity.Block;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetBlockListService implements GetBlockListUseCase {

    private final LoadBlockPort loadBlockPort;

    @Override
    public BlockListResult execute(GetBlockListCommand command) {
        Pageable pageable = PageRequest.of(command.getPage(), command.getSize());
        Page<Block> result;

        boolean hasCategory = command.getCategory() != null;
        boolean hasKeyword = command.getKeyword() != null && !command.getKeyword().isBlank();

        if (hasKeyword && hasCategory) {
            // 키워드 + 카테고리
            result = loadBlockPort.searchByKeywordAndCategory(
                    command.getAccountId(),
                    command.getKeyword(),
                    command.getCategory(),
                    pageable
            );
        } else if (hasKeyword) {
            // 키워드만
            result = loadBlockPort.searchByKeyword(
                    command.getAccountId(),
                    command.getKeyword(),
                    pageable
            );
        } else if (hasCategory) {
            // 카테고리만
            result = loadBlockPort.findAllByAccountIdAndCategory(
                    command.getAccountId(),
                    command.getCategory(),
                    pageable
            );
        } else {
            // 전체
            result = loadBlockPort.findAllByAccountId(
                    command.getAccountId(),
                    pageable
            );
        }

        return BlockListResult.from(result);
    }
}
