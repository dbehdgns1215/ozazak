package com.b205.ozazak.presentation.block.getBlockList;

import com.b205.ozazak.application.block.result.BlockListResult;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class GetBlockListResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final List<BlockItem> blocks;
        private final PageInfo pageInfo;
    }

    @Getter
    @Builder
    public static class BlockItem {
        private final Long blockId;
        private final String title;
        private final List<String> categories;  // ← String[]
        private final String content;
        // rate는 추후 구현
    }

    @Getter
    @Builder
    public static class PageInfo {
        private final int currentPage;
        private final int totalPages;
        private final long totalElements;
        private final boolean hasNext;
    }

    public static GetBlockListResponse from(BlockListResult result) {
        List<BlockItem> items = result.getBlocks().stream()
                .map(b -> BlockItem.builder()
                        .blockId(b.getBlockId())
                        .title(b.getTitle())
                        .categories(b.getCategories())
                        .content(b.getContent())
                        .build())
                .collect(Collectors.toList());

        return GetBlockListResponse.builder()
                .data(Data.builder()
                        .blocks(items)
                        .pageInfo(PageInfo.builder()
                                .currentPage(result.getPageInfo().getCurrentPage())
                                .totalPages(result.getPageInfo().getTotalPages())
                                .totalElements(result.getPageInfo().getTotalElements())
                                .hasNext(result.getPageInfo().isHasNext())
                                .build())
                        .build())
                .build();
    }
}
