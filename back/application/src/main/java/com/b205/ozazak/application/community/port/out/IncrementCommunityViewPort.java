package com.b205.ozazak.application.community.port.out;

public interface IncrementCommunityViewPort {
    /**
     * Increment view count for a community by 1
     * @param communityId the ID of the community
     */
    void incrementView(Long communityId);
}
