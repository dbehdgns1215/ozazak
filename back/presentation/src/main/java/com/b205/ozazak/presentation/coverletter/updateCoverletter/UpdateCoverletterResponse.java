package com.b205.ozazak.presentation.coverletter.updateCoverletter;

import com.b205.ozazak.application.coverletter.result.UpdateCoverletterResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateCoverletterResponse {
    private final Data data;
    
    @Getter
    @Builder
    public static class Data {
        private final Long coverletterId;
        private final String title;
        private final Boolean isComplete;
        private final Boolean isPassed;
        private final Integer updatedEssayCount;
    }
    
    public static UpdateCoverletterResponse from(UpdateCoverletterResult result) {
        return UpdateCoverletterResponse.builder()
                .data(Data.builder()
                        .coverletterId(result.getCoverletterId())
                        .title(result.getTitle())
                        .isComplete(result.getIsComplete())
                        .isPassed(result.getIsPassed())
                        .updatedEssayCount(result.getUpdatedEssayCount())
                        .build())
                .build();
    }
}
