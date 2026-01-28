package com.b205.ozazak.presentation.essay.updateEssay;

import com.b205.ozazak.application.essay.result.UpdateEssayResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateEssayResponse {
    private final Data data;
    
    @Getter
    @Builder
    public static class Data {
        private final Long essayId;
        private final Integer version;
        private final String versionTitle;
        private final String content;
    }
    
    public static UpdateEssayResponse from(UpdateEssayResult result) {
        return UpdateEssayResponse.builder()
                .data(Data.builder()
                        .essayId(result.getEssayId())
                        .version(result.getVersion())
                        .versionTitle(result.getVersionTitle())
                        .content(result.getContent())
                        .build())
                .build();
    }
}
