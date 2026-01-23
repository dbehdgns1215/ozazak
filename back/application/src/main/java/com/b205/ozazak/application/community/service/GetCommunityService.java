package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.dto.GetCommunityResult;
import com.b205.ozazak.application.community.port.in.GetCommunityUseCase;
import com.b205.ozazak.application.community.port.out.LoadCommunityPort;
import com.b205.ozazak.domain.community.entity.Community;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetCommunityService implements GetCommunityUseCase {

    private final LoadCommunityPort loadCommunityPort;

    @Override
    public GetCommunityResult getCommunity(Long communityId) {
        Community community = loadCommunityPort.loadCommunity(communityId)
                .orElseThrow(() -> new IllegalArgumentException("Community not found: " + communityId));
        return GetCommunityResult.from(community);
    }

    @Override
    public Page<GetCommunityResult> getCommunityList(Pageable pageable) {
        return loadCommunityPort.findSummaries(pageable)
                .map(GetCommunityResult::from);
    }
}
