package com.b205.ozazak.presentation.block.generateBlocks;

import com.b205.ozazak.application.block.result.BlockDetailResult;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class GenerateBlocksResponse {
    private final List<BlockDetailDto> blocks;

    @Getter
    @Builder
    public static class BlockDetailDto {
        private final Long blockId;
        private final String title;
        private final List<Integer> categories;
        private final String content;
    }

    public static GenerateBlocksResponse from(List<BlockDetailResult> results) {
        return GenerateBlocksResponse.builder()
                .blocks(results.stream()
                        .map(r -> BlockDetailDto.builder()
                                .blockId(r.getBlockId())
                                .title(r.getTitle())
                                .categories(r.getCategories())
                                .content(r.getContent())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
