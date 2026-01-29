package com.b205.ozazak.presentation.coverletter.createCoverletter;

import com.b205.ozazak.application.coverletter.result.CreateCoverletterResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateCoverletterResponse {
    private final Data data;
    
    @Getter
    @Builder
    public static class Data {
        private final Long coverletterId;
        private final String title;
    }
    
    public static CreateCoverletterResponse from(CreateCoverletterResult result) {
        return CreateCoverletterResponse.builder()
                .data(Data.builder()
                        .coverletterId(result.getCoverletterId())
                        .title(result.getTitle())
                        .build())
                .build();
    }
}
