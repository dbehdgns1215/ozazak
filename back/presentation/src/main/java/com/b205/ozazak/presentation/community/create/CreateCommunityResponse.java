package com.b205.ozazak.presentation.community.create;

public record CreateCommunityResponse(Long communityId) {
    
    public static CreateCommunityResponse from(Long communityId) {
        return new CreateCommunityResponse(communityId);
    }
}
