package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.in.GetCommunityUseCase;
import com.b205.ozazak.application.community.port.out.IncrementCommunityViewPort;
import com.b205.ozazak.application.community.port.out.LoadCommunityDetailPort;
import com.b205.ozazak.application.community.port.out.dto.CommunityDetail;
import com.b205.ozazak.application.community.result.GetCommunityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetCommunityService implements GetCommunityUseCase {

    private final LoadCommunityDetailPort loadCommunityDetailPort;
    private final IncrementCommunityViewPort incrementCommunityViewPort;

    @Override
    @Transactional
    public GetCommunityResult get(Long communityId, Long requesterAccountId) {
        // Increment view count
        incrementCommunityViewPort.incrementView(communityId);
        
        CommunityDetail detail = loadCommunityDetailPort.loadCommunityDetail(communityId, requesterAccountId)
                .orElseThrow(() -> new CommunityException(CommunityErrorCode.NOT_FOUND));

        return GetCommunityResult.builder()
                .communityId(detail.getCommunityId())
                .communityCode(detail.getCommunityCode())
                .title(detail.getTitle())
                .content(detail.getContent())
                .authorId(detail.getAuthor().getAccountId())
                .authorName(detail.getAuthor().getName())
                .authorImg(detail.getAuthor().getImg())
                .companyName(detail.getAuthor().getCompanyName())
                .view(detail.getView())
                .commentCount(detail.getCommentCount())
                .tags(detail.getTags())
                .reaction(mapReactions(detail.getReaction()))
                .userReaction(mapReactions(detail.getUserReaction()))
                .createdAt(detail.getCreatedAt())
                .build();
    }

    private List<GetCommunityResult.ReactionInfo> mapReactions(List<CommunityDetail.ReactionCount> reactions) {
        if (reactions == null) return List.of();
        return reactions.stream()
                .map(r -> GetCommunityResult.ReactionInfo.builder()
                        .type(r.getType())
                        .count(r.getCount())
                        .build())
                .collect(Collectors.toList());
    }
}
