package com.b205.ozazak.application.project.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetProjectCommand {
    private final Long userId;
    private final Long projectId;
}
