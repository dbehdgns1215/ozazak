package com.b205.ozazak.presentation.coverletter.checkCoverletter;

import com.b205.ozazak.application.coverletter.result.CheckCoverletterResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CheckCoverletterResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Boolean exist;
        private final Long coverLetterId;
    }

    public static CheckCoverletterResponse from(CheckCoverletterResult result) {
        return CheckCoverletterResponse.builder()
                .data(Data.builder()
                        .exist(result.isExist())
                        .coverLetterId(result.getCoverletterId())
                        .build())
                .build();
    }
}
