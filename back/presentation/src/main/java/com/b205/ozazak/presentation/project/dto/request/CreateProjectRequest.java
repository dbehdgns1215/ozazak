package com.b205.ozazak.presentation.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class CreateProjectRequest {

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    @NotBlank(message = "내용은 필수입니다")
    private String content;

    private String image;

    @NotNull(message = "시작일은 필수입니다")
    private LocalDate startedAt;

    private LocalDate endedAt;

    private List<String> tags;
}
