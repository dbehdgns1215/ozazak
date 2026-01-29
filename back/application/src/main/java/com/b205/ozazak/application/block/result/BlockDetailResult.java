package com.b205.ozazak.application.block.result;

import com.b205.ozazak.application.block.service.BlockCategoryMapper;
import com.b205.ozazak.domain.block.entity.Block;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class BlockDetailResult {
    private final Long blockId;
    private final String title;
    private final List<String> categories;  // ← String[] 이름으로 반환
    private final String content;
    // rate는 추후 구현

    public static BlockDetailResult from(Block block) {
        // 코드 → 이름 변환
        List<String> categoryNames = BlockCategoryMapper.toNames(
                block.getCategories() != null ? block.getCategories().value() : List.of()
        );

        return BlockDetailResult.builder()
                .blockId(block.getId().value())
                .title(block.getTitle().value())
                .categories(categoryNames)
                .content(block.getContent().value())
                .build();
    }
}
