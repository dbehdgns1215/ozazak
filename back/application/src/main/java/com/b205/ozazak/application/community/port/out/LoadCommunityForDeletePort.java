package com.b205.ozazak.application.community.port.out;

public interface LoadCommunityForDeletePort {
    CommunityDeleteProjection loadForDelete(Long communityId);
}
