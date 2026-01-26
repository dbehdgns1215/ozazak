package com.b205.ozazak.application.community.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommunitySummaryResult {
    private final Long communityId;
    private final String title;
    private final AuthorSummaryResult author;
    private final Long commentCount;
}
