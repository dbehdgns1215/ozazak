package com.b205.ozazak.presentation.block.getBlockDetail;

import com.b205.ozazak.application.block.result.BlockDetailResult;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GetBlockDetailResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long blockId;
        private final String title;
        private final List<String> categories;  // ← String[]
        private final String content;
    }

    public static GetBlockDetailResponse from(BlockDetailResult result) {
        return GetBlockDetailResponse.builder()
                .data(Data.builder()
                        .blockId(result.getBlockId())
                        .title(result.getTitle())
                        .categories(result.getCategories())
                        .content(result.getContent())
                        .build())
                .build();
    }
}
