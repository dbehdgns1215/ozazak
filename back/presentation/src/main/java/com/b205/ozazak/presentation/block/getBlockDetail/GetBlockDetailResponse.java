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
        private final List<Integer> categories;  // Integer 코드
        private final String content;
        private final String sourceType;  // "PROJECT", "TIL", "COVER_LETTER", "USER_GENERATED"
        private final String sourceTitle;  // 프로젝트 이름, TIL 제목, 자소서 제목
    }

    public static GetBlockDetailResponse from(BlockDetailResult result) {
        return GetBlockDetailResponse.builder()
                .data(Data.builder()
                        .blockId(result.getBlockId())
                        .title(result.getTitle())
                        .categories(result.getCategories())
                        .content(result.getContent())
                        .sourceType(result.getSourceType())
                        .sourceTitle(result.getSourceTitle())
                        .build())
                .build();
    }
}
