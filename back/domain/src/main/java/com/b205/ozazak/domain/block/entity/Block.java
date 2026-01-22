package com.b205.ozazak.domain.block.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.block.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Block {
    private final BlockId id;
    private final Account account;
    private final BlockTitle title;
    private final BlockContent content;
    private final Vector vector;
    private final DeletedAt deletedAt;
}
