package com.b205.ozazak.application.block.service;

import com.b205.ozazak.application.block.command.CreateBlockCommand;
import com.b205.ozazak.application.block.port.in.CreateBlockUseCase;
import com.b205.ozazak.application.block.port.out.SaveBlockPort;
import com.b205.ozazak.application.block.result.CreateBlockResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.block.entity.Block;
import com.b205.ozazak.domain.block.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateBlockService implements CreateBlockUseCase {

    private final SaveBlockPort saveBlockPort;

    @Override
    public CreateBlockResult execute(CreateBlockCommand command) {
        // 카테고리 이름 → 코드 변환
        List<Integer> categoryCodes = BlockCategoryMapper.toCodes(command.getCategories());

        Block block = Block.builder()
                .account(Account.builder()
                        .id(new AccountId(command.getAccountId()))
                        .build())
                .title(new BlockTitle(command.getTitle()))
                .content(new BlockContent(command.getContent()))
                .categories(new Categories(categoryCodes))
                .build();

        Block saved = saveBlockPort.save(block);

        return CreateBlockResult.builder()
                .blockId(saved.getId().value())
                .build();
    }
}
