package com.b205.ozazak.presentation.community.update;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "Update Community Request")
public record UpdateCommunityRequest(
    @NotNull(message = "Community code is required")
    @Schema(description = "Community Code (1: TIL, 2: Free, 3: Q&A)", example = "1")
    Integer communityCode,

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be 100 characters or less")
    @Schema(description = "Title", example = "Updated TIL Title")
    String title,

    @NotBlank(message = "Content is required")
    @Size(max = 10000, message = "Content must be 10000 characters or less")
    @Schema(description = "Content", example = "Updated content...")
    String content,

    @NotNull(message = "Tags list cannot be null")
    @Schema(description = "Tags (Create empty list if none)", example = "[\"Spring\", \"Update\"]")
    List<@NotBlank(message = "Tag cannot be blank") @Size(max = 50, message = "Tag length must be 50 or less") String> tags
) {
}
