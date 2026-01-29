package com.b205.ozazak.application.community.port.out.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryStat {
    private final Integer communityCode;
    private final Long totalCount;
    private final Long todayCount;
}
