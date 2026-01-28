package com.b205.ozazak.application.coverletter.command;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UpdateCoverletterCommand {
    private final Long coverletterId;
    private final Long accountId;       // 소유권 검증
    private final String title;
    private final Boolean isComplete;
    private final Boolean isPassed;
    private final List<EssayUpdateData> essays;
    
    @Getter
    @Builder
    public static class EssayUpdateData {
        private final Long essayId;
        private final String content;
    }
}
