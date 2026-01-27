package com.b205.ozazak.application.recruitment.port.in;

import com.b205.ozazak.application.recruitment.command.GetRecruitmentDetailCommand;
import com.b205.ozazak.application.recruitment.result.RecruitmentDetailResult;

public interface GetRecruitmentDetailUseCase {
    RecruitmentDetailResult execute(GetRecruitmentDetailCommand command);
}
