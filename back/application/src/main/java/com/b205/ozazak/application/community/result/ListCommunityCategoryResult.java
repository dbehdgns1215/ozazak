package com.b205.ozazak.application.community.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class ListCommunityCategoryResult {
    private final List<CategoryItem> items;

    @Getter
    @Builder
    public static class CategoryItem {
        private final Integer communityCode;
        private final String title;
        private final String description;
        private final Long totalPostCount;
        private final Long todayPostCount;
    }
}
