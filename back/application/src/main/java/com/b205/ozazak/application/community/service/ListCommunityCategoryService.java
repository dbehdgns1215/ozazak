package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.port.in.ListCommunityCategoryUseCase;
import com.b205.ozazak.application.community.port.out.LoadCommunityCategoryStatsPort;
import com.b205.ozazak.application.community.port.out.model.CategoryStat;
import com.b205.ozazak.application.community.result.ListCommunityCategoryResult;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListCommunityCategoryService implements ListCommunityCategoryUseCase {

    private final LoadCommunityCategoryStatsPort loadStatsPort;

    @Getter
    @RequiredArgsConstructor
    private enum CategoryCatalog {
        TIL(1, "TIL", "Today I Learned"),
        ERROR_ARCHIVE(2, "Error Archive", "Collect and share error solutions"),
        LIBRARY(3, "Library", "Share useful libraries"),
        QNA(4, "Q&A", "Questions and Answers");

        private final int code;
        private final String title;
        private final String description;
    }

    @Override
    public ListCommunityCategoryResult list() {
        // 1. Determine "Today" range in KST
        ZoneId kst = ZoneId.of("Asia/Seoul");
        LocalDateTime startOfToday = LocalDateTime.now(kst).toLocalDate().atStartOfDay();
        LocalDateTime startOfTomorrow = startOfToday.plusDays(1);

        // 2. Load stats from DB
        Map<Integer, CategoryStat> statsMap = loadStatsPort.loadStats(startOfToday, startOfTomorrow);

        // 3. Merge with Catalog
        List<ListCommunityCategoryResult.CategoryItem> items = Arrays.stream(CategoryCatalog.values())
                .map(cat -> {
                    CategoryStat stat = statsMap.getOrDefault(cat.code, 
                            CategoryStat.builder()
                                    .communityCode(cat.code)
                                    .totalCount(0L)
                                    .todayCount(0L)
                                    .build());
                    
                    return ListCommunityCategoryResult.CategoryItem.builder()
                            .communityCode(cat.code)
                            .title(cat.title)
                            .description(cat.description)
                            .totalPostCount(stat.getTotalCount())
                            .todayPostCount(stat.getTodayCount())
                            .build();
                })
                .collect(Collectors.toList());

        return ListCommunityCategoryResult.builder()
                .items(items)
                .build();
    }
}
