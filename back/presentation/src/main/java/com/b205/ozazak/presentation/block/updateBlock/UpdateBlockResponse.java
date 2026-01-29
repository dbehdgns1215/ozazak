package com.b205.ozazak.presentation.block.updateBlock;

import com.b205.ozazak.application.block.result.UpdateBlockResult;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UpdateBlockResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long blockId;
        private final String title;
        private final List<Integer> categories;  // 카테고리 코드 (0~14)
        private final String content;
    }

    public static UpdateBlockResponse from(UpdateBlockResult result) {
        return UpdateBlockResponse.builder()
                .data(Data.builder()
                        .blockId(result.getBlockId())
                        .title(result.getTitle())
                        .categories(result.getCategories())
                        .content(result.getContent())
                        .build())
                .build();
    }
}
