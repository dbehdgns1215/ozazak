package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.result.GetCommunityResult;

public interface GetCommunityUseCase {
    GetCommunityResult get(Long communityId, Long requesterAccountId);
}
