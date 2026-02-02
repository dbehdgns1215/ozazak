package com.b205.ozazak.presentation.community.update;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Update Community Response")
public record UpdateCommunityResponse(
    @Schema(description = "Updated Community ID", example = "123")
    Long communityId
) {
}
