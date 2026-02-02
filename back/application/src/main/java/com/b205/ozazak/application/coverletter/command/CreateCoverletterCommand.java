package com.b205.ozazak.application.coverletter.command;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CreateCoverletterCommand {
    private final Long accountId;
    private final Long recruitmentId;  // nullable - 모집 끝난 공고
    private final String title;
    private final List<EssayData> essays;
    
    @Getter
    @Builder
    public static class EssayData {
        private final String questionContent;
        private final String essayContent;
        private final Integer charMax;
    }
}
