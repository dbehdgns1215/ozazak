package com.b205.ozazak.presentation.block.createBlock;

import com.b205.ozazak.application.block.result.CreateBlockResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateBlockResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long blockId;
    }

    public static CreateBlockResponse from(CreateBlockResult result) {
        return CreateBlockResponse.builder()
                .data(Data.builder()
                        .blockId(result.getBlockId())
                        .build())
                .build();
    }
}
