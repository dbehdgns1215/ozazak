package com.b205.ozazak.presentation.resume.read;

import java.util.List;

public record GetUserResumesResponse(
    Long userId,
    List<ResumeResponseDto> resumes
) {}
