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
        TIL(1, "TIL", "오늘 배운 내용을 기록하고 공유하는 게시판"),
        FREE_BOARD(2, "자유게시판", "주제 제한 없이 자유롭게 소통하는 게시판"),
        HOT_BOARD(3, "HOT 게시판", "많은 관심을 받은 인기 게시글 모음"),
        JOB_REVIEW(4, "취업 후기", "취업 준비 및 합격 경험을 공유하는 게시판"),
        COVER_LETTER_REVIEW(5, "자소서 첨삭", "자기소개서를 서로 첨삭하고 피드백하는 게시판"),
        STUDY_RECRUITMENT(6, "스터디 모집", "함께 공부할 스터디원을 모집하는 게시판"),
        QNA(7, "질문 & 답변", "궁금한 점을 질문하고 답변을 나누는 게시판");

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
