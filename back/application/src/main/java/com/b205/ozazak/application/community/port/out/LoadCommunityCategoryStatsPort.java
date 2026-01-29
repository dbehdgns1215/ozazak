package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.application.community.port.out.model.CategoryStat;
import java.time.LocalDateTime;
import java.util.Map;

public interface LoadCommunityCategoryStatsPort {
    /**
     * Loads stats for all categories.
     * key: communityCode
     * value: stats
     */
    Map<Integer, CategoryStat> loadStats(LocalDateTime start, LocalDateTime end);
}
