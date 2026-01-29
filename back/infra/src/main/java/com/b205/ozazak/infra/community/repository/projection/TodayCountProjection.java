package com.b205.ozazak.infra.community.repository.projection;

public interface TodayCountProjection {
    Integer getCommunityCode();
    Long getTodayCount();
}
