package com.b205.ozazak.application.community.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthorSummaryDto {
    private final Long accountId;
    private final String name;
    private final String img;
}
