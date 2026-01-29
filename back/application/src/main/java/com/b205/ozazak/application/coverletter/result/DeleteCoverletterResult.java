package com.b205.ozazak.application.coverletter.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteCoverletterResult {
    private final Long deletedCoverletterId;
    private final Integer deletedEssayCount;
}
