package com.b205.ozazak.application.project.command;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Pageable;

@Getter
@Builder
public class GetProjectListCommand {
    private final Long accountId;
    private final Pageable pageable;
}
