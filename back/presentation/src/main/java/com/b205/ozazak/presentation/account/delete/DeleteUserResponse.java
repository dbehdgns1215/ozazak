package com.b205.ozazak.presentation.account.delete;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Schema(description = "Delete User Response")
@Getter
@Builder
public class DeleteUserResponse {
    
    @Schema(description = "Deleted user ID", example = "36")
    private final Long userId;
}
