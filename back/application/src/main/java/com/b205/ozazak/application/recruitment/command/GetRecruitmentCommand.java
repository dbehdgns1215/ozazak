package com.b205.ozazak.application.recruitment.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetRecruitmentCommand {
    private final Long recruitmentId;
    private final Long accountId;
}
