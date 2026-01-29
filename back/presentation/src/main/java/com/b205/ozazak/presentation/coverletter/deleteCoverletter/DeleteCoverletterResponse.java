package com.b205.ozazak.presentation.coverletter.deleteCoverletter;

import com.b205.ozazak.application.coverletter.result.DeleteCoverletterResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteCoverletterResponse {
    private final Data data;
    
    @Getter
    @Builder
    public static class Data {
        private final Long deletedCoverletterId;
        private final Integer deletedEssayCount;
    }
    
    public static DeleteCoverletterResponse from(DeleteCoverletterResult result) {
        return DeleteCoverletterResponse.builder()
                .data(Data.builder()
                        .deletedCoverletterId(result.getDeletedCoverletterId())
                        .deletedEssayCount(result.getDeletedEssayCount())
                        .build())
                .build();
    }
}
