package com.b205.ozazak.application.block.result;

import com.b205.ozazak.domain.block.entity.Block;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class BlockListResult {
    private final List<BlockDetailResult> blocks;
    private final PageInfo pageInfo;

    @Getter
    @Builder
    public static class PageInfo {
        private final int currentPage;
        private final int totalPages;
        private final long totalElements;
        private final boolean hasNext;
    }

    public static BlockListResult from(Page<Block> page) {
        List<BlockDetailResult> blocks = page.getContent().stream()
                .map(BlockDetailResult::from)
                .collect(Collectors.toList());

        return BlockListResult.builder()
                .blocks(blocks)
                .pageInfo(PageInfo.builder()
                        .currentPage(page.getNumber())
                        .totalPages(page.getTotalPages())
                        .totalElements(page.getTotalElements())
                        .hasNext(page.hasNext())
                        .build())
                .build();
    }
}
