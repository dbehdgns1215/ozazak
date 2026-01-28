package com.b205.ozazak.presentation.community.category.read;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class ListCommunityCategoryResponse {
    
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
