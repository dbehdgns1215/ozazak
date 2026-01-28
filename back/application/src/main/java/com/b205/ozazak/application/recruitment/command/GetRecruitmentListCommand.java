package com.b205.ozazak.application.recruitment.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetRecruitmentListCommand {
    private final Long accountId;
    private final Integer year;
    private final Integer month;
}
