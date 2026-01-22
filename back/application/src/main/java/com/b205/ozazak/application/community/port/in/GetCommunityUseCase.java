package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.dto.GetCommunityResult;

public interface GetCommunityUseCase {
    GetCommunityResult getCommunity(Long communityId);
}
