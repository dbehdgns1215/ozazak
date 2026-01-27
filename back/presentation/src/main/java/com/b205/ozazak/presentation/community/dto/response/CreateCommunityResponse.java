package com.b205.ozazak.presentation.community.dto.response;

public record CreateCommunityResponse(Long communityId) {
    
    public static CreateCommunityResponse from(Long communityId) {
        return new CreateCommunityResponse(communityId);
    }
}
