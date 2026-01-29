package com.b205.ozazak.presentation.block.deleteBlock;

import com.b205.ozazak.application.block.result.DeleteBlockResult;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DeleteBlockResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long blockId;
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private final LocalDateTime deletedAt;
    }

    public static DeleteBlockResponse from(DeleteBlockResult result) {
        return DeleteBlockResponse.builder()
                .data(Data.builder()
                        .blockId(result.getBlockId())
                        .deletedAt(result.getDeletedAt())
                        .build())
                .build();
    }
}
