package com.b205.ozazak.presentation.block.updateBlock;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class UpdateBlockRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Categories is required")
    private List<String> categories;  // ← String[]로 변경

    @NotBlank(message = "Content is required")
    private String content;
}
