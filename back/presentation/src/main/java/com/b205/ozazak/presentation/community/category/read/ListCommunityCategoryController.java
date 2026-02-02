package com.b205.ozazak.presentation.community.category.read;

import com.b205.ozazak.application.community.port.in.ListCommunityCategoryUseCase;
import com.b205.ozazak.application.community.result.ListCommunityCategoryResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community-category")
@RequiredArgsConstructor
public class ListCommunityCategoryController {

    private final ListCommunityCategoryUseCase listCommunityCategoryUseCase;

    @GetMapping
    public ResponseEntity<Map<String, ListCommunityCategoryResponse>> list() {
        ListCommunityCategoryResult result = listCommunityCategoryUseCase.list();
        
        List<ListCommunityCategoryResponse.CategoryItem> responseItems = result.getItems().stream()
                .map(item -> ListCommunityCategoryResponse.CategoryItem.builder()
                        .communityCode(item.getCommunityCode())
                        .title(item.getTitle())
                        .description(item.getDescription())
                        .totalPostCount(item.getTotalPostCount())
                        .todayPostCount(item.getTodayPostCount())
                        .build())
                .collect(Collectors.toList());
                
        ListCommunityCategoryResponse response = ListCommunityCategoryResponse.builder()
                .items(responseItems)
                .build();
                
        return ResponseEntity.ok(Map.of("data", response));
    }
}
