package com.b205.ozazak.presentation.community.view;

import com.b205.ozazak.application.community.port.in.GetCommunityUseCase;
import com.b205.ozazak.application.community.result.GetCommunityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class GetCommunityController {

    private final GetCommunityUseCase getCommunityUseCase;

    @GetMapping("/{communityId}")
    public ResponseEntity<Map<String, GetCommunityResponse>> get(
        @PathVariable Long communityId, 
        @AuthenticationPrincipal com.b205.ozazak.application.auth.model.CustomPrincipal principal
    ) {
        Long requesterAccountId = (principal != null) ? principal.getAccountId() : null;

        GetCommunityResult result = getCommunityUseCase.get(communityId, requesterAccountId);

        GetCommunityResponse response = GetCommunityResponse.builder()
                .communityId(result.getCommunityId())
                .communityCode(result.getCommunityCode())
                .title(result.getTitle())
                .content(result.getContent())
                .createdAt(result.getCreatedAt())
                .view(result.getView())
                .commentCount(result.getCommentCount())
                .tags(result.getTags())
                .reactions(result.getReactions().stream()
                        .map(r -> GetCommunityResponse.ReactionInfo.builder()
                                .type(r.getType())
                                .count(r.getCount())
                                .build())
                        .collect(Collectors.toList()))
                .userReactions(result.getUserReactions() != null ?
                        result.getUserReactions().stream()
                                .map(r -> GetCommunityResponse.ReactionInfo.builder()
                                        .type(r.getType())
                                        .count(r.getCount())
                                        .build())
                                .collect(Collectors.toList())
                        : java.util.Collections.emptyList())
                .author(GetCommunityResponse.AuthorInfo.builder()
                        .accountId(result.getAuthorId())
                        .name(result.getAuthorName())
                        .img(result.getAuthorImg())
                        .companyName(result.getCompanyName())
                        .build())
                .build();

        return ResponseEntity.ok(Map.of("data", response));
    }
}
