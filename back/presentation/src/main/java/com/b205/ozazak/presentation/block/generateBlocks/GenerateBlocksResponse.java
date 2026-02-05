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
        private final String sourceType;  // "PROJECT", "TIL", "COVER_LETTER", "USER_GENERATED"
        private final String sourceTitle;  // 프로젝트 이름, TIL 제목, 자소서 제목
    }

    public static GenerateBlocksResponse from(List<BlockDetailResult> results) {
        return GenerateBlocksResponse.builder()
                .blocks(results.stream()
                        .map(r -> BlockDetailDto.builder()
                                .blockId(r.getBlockId())
                                .title(r.getTitle())
                                .categories(r.getCategories())
                                .content(r.getContent())
                                .sourceType(r.getSourceType())
                                .sourceTitle(r.getSourceTitle())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
