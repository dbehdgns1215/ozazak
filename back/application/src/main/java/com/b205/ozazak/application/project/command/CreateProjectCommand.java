package com.b205.ozazak.application.project.command;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class CreateProjectCommand {
    private final Long accountId;
    private final String title;
    private final String content;
    private final String image;
    private final LocalDate startedAt;
    private final LocalDate endedAt;
    private final List<String> tags;
}
