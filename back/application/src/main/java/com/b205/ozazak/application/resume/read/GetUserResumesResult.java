package com.b205.ozazak.application.resume.read;

import com.b205.ozazak.application.resume.result.ResumeDataDto;

import java.util.List;

public record GetUserResumesResult(
    Long userId,
    List<ResumeDataDto> resumes
) {}
