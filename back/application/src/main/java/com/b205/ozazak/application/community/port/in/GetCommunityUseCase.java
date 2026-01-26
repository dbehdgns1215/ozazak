package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.result.GetCommunityResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GetCommunityUseCase {
    GetCommunityResult getCommunity(Long communityId);
    Page<GetCommunityResult> getCommunityList(Pageable pageable);
}
