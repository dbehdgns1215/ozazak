package com.b205.ozazak.presentation.community.til.reaction.delete;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;

public record DeleteTilReactionRequest(
    @NotNull @Valid ReactionRequestDto reaction
) {
    public record ReactionRequestDto(
        @Schema(description = "Reaction type code", example = "1")
        @NotNull Integer type
    ) {}
}
