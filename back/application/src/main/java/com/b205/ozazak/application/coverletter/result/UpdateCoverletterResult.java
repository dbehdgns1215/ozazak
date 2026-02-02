package com.b205.ozazak.application.coverletter.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateCoverletterResult {
    private final Long coverletterId;
    private final String title;
    private final Boolean isComplete;
    private final Boolean isPassed;
    private final Integer updatedEssayCount;
}
