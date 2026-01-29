package com.b205.ozazak.presentation.essay.createEssayVersion;

import com.b205.ozazak.application.essay.result.CreateEssayVersionResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateEssayVersionResponse {
    private final Data data;
    
    @Getter
    @Builder
    public static class Data {
        private final Long essayId;
        private final Integer version;
        private final String versionTitle;
        private final String content;
        private final Long baseEssayId;
    }
    
    public static CreateEssayVersionResponse from(CreateEssayVersionResult result) {
        return CreateEssayVersionResponse.builder()
                .data(Data.builder()
                        .essayId(result.getEssayId())
                        .version(result.getVersion())
                        .versionTitle(result.getVersionTitle())
                        .content(result.getContent())
                        .baseEssayId(result.getBaseEssayId())
                        .build())
                .build();
    }
}
