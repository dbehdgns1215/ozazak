package com.b205.ozazak.application.community.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthorSummaryResult {
    private final Long accountId;
    private final String name;
    private final String img;
}
