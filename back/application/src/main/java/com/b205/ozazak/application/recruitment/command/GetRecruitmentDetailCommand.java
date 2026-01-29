package com.b205.ozazak.application.recruitment.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetRecruitmentDetailCommand {
    private final Long recruitmentId;
}
