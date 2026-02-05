package com.b205.ozazak.domain.block.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.block.enums.SourceType;
import com.b205.ozazak.domain.block.vo.*;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class Block {
    private final BlockId id;
    private final Account account;
    private final BlockTitle title;
    private final BlockContent content;
    private final Categories categories;  // 카테고리 목록 추가
    private final SourceType sourceType;  // 출처 유형
    private final SourceTitle sourceTitle;  // 출처 제목 (프로젝트명, TIL 제목 등)
    private final DeletedAt deletedAt;
}
