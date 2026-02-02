package com.b205.ozazak.application.coverletter.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CheckCoverletterResult {
    private final boolean exist;
    private final Long coverletterId;
    
    public static CheckCoverletterResult existing(Long coverletterId) {
        return CheckCoverletterResult.builder()
                .exist(true)
                .coverletterId(coverletterId)
                .build();
    }
    
    public static CheckCoverletterResult created(Long coverletterId) {
        return CheckCoverletterResult.builder()
                .exist(false)
                .coverletterId(coverletterId)
                .build();
    }
}
