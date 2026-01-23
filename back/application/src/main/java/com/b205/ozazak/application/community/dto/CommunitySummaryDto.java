package com.b205.ozazak.application.community.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommunitySummaryDto {
    private final Long communityId;
    private final String title;
    private final AuthorSummaryDto author;
    private final Long commentCount;
}
