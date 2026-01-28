package com.b205.ozazak.presentation.account.update;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Schema(description = "Update User Info Response")
@Getter
@Builder
public class UpdateUserInfoResponse {
    
    @Schema(description = "Updated user ID")
    private final Long userId;
}
