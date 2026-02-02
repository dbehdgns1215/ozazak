package com.b205.ozazak.application.block.result;

import com.b205.ozazak.domain.block.entity.Block;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class BlockDetailResult {
    private final Long blockId;
    private final String title;
    private final List<Integer> categories;  // 카테고리 코드 (0~14)
    private final String content;
    // rate는 추후 구현

    public static BlockDetailResult from(Block block) {
        return BlockDetailResult.builder()
                .blockId(block.getId().value())
                .title(block.getTitle().value())
                .categories(block.getCategories() != null ? block.getCategories().value() : List.of())
                .content(block.getContent().value())
                .build();
    }
}
