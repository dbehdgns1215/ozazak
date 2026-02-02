package com.b205.ozazak.presentation.community.delete;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for deleting a community post
 */
public record DeleteCommunityRequest(
    @NotNull(message = "Community ID is required")
    Long communityId,
    
    @NotNull(message = "Account ID is required")
    Long accountId
) {}
