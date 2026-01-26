package com.b205.ozazak.presentation.community.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateCommunityRequest(
        @NotNull(message = "Community code is required")
        Integer communityCode,

        @NotBlank(message = "Title is required")
        @Size(max = 100, message = "Title must not exceed 100 characters")
        String title,

        @NotBlank(message = "Content is required")
        @Size(max = 10000, message = "Content must not exceed 10000 characters")
        String content,

        @NotNull(message = "Tags list is required")
        List<@NotBlank(message = "Tag must not be blank") @Size(max = 50, message = "Tag must not exceed 50 characters") String> tags
) {}
