package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.application.community.port.out.dto.CommunityDeleteProjection;

public interface LoadCommunityForDeletePort {
    CommunityDeleteProjection loadForDelete(Long communityId);
}
