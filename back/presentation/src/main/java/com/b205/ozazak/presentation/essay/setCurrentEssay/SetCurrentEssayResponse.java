package com.b205.ozazak.presentation.essay.setCurrentEssay;

import com.b205.ozazak.application.essay.result.SetCurrentEssayResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SetCurrentEssayResponse {
    private final Data data;
    
    @Getter
    @Builder
    public static class Data {
        private final Long currentEssayId;
        private final Integer version;
    }
    
    public static SetCurrentEssayResponse from(SetCurrentEssayResult result) {
        return SetCurrentEssayResponse.builder()
                .data(Data.builder()
                        .currentEssayId(result.getCurrentEssayId())
                        .version(result.getVersion())
                        .build())
                .build();
    }
}
