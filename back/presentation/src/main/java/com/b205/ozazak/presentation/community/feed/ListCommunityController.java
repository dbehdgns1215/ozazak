package com.b205.ozazak.presentation.community.feed;

import com.b205.ozazak.application.community.command.ListCommunityCommand;
import com.b205.ozazak.application.community.port.in.ListCommunityUseCase;
import com.b205.ozazak.application.community.result.ListCommunityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class ListCommunityController {

    private final ListCommunityUseCase listCommunityUseCase;

    @GetMapping
    public ResponseEntity<Map<String, ListCommunityResponse>> list(
            @RequestParam(required = false) Integer communityCode,
            @RequestParam(required = false) String authorName,
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.b205.ozazak.application.auth.model.CustomPrincipal principal
    ) {
        Long requesterAccountId = (principal != null) ? principal.getAccountId() : null;
 
        if (searchKeyword != null) {
            searchKeyword = searchKeyword.trim();
            if (searchKeyword.isEmpty()) {
                searchKeyword = null;
            } else if (searchKeyword.length() > 100) {
                throw new com.b205.ozazak.application.community.exception.CommunityException(
                    com.b205.ozazak.application.community.exception.CommunityErrorCode.BAD_REQUEST,
                    "Search keyword must be 100 characters or less."
                );
            }
        }

        ListCommunityCommand command = ListCommunityCommand.builder()
                .communityCode(communityCode)
                .authorName(authorName)
                .searchKeyword(searchKeyword)
                .tags(tags)
                .pageable(pageable)
                .requesterAccountId(requesterAccountId)
                .build();
 
        ListCommunityResult result = listCommunityUseCase.list(command);
 
        List<ListCommunityResponse.CommunityItem> items = result.getItems().stream()
                .map(this::mapItem)
                .collect(Collectors.toList());
 
        ListCommunityResponse response = ListCommunityResponse.builder()
                .items(items)
                .page(ListCommunityResponse.PageInfo.builder()
                        .totalPage(result.getResultPage().getTotalPage())
                        .currentPage(result.getResultPage().getCurrentPage())
                        .totalElements(result.getResultPage().getTotalElements())
                        .size(result.getResultPage().getSize())
                        .build())
                .build();
 
        return ResponseEntity.ok(Map.of("data", response));
    }

    private ListCommunityResponse.CommunityItem mapItem(ListCommunityResult.CommunityItem item) {
        return ListCommunityResponse.CommunityItem.builder()
                .communityId(item.getCommunityId())
                .communityCode(item.getCommunityCode())
                .title(item.getTitle())
                .content(item.getContent()) // Preview/Summary? Adapters usually return full content, Controller can truncate if needed. MVP says "preview/summary OK". I'll pass through.
                .createdAt(item.getCreatedAt())
                .view(item.getView())
                .commentCount(item.getCommentCount())
                .tags(item.getTags())
                .reaction(item.getReaction().stream()
                        .map(r -> ListCommunityResponse.ReactionInfo.builder()
                                .type(r.getType())
                                .count(r.getCount())
                                .build())
                        .collect(Collectors.toList()))
                .userReaction(item.getUserReaction() != null ?
                        item.getUserReaction().stream()
                                .map(r -> ListCommunityResponse.ReactionInfo.builder()
                                        .type(r.getType())
                                        .count(r.getCount())
                                        .build())
                                .collect(Collectors.toList())
                        : java.util.Collections.emptyList())
                .author(ListCommunityResponse.AuthorInfo.builder()
                        .accountId(item.getAuthorId())
                        .name(item.getAuthorName())
                        .img(item.getAuthorImg())
                        .companyName(item.getCompanyName())
                        .build())
                .build();
    }
}
