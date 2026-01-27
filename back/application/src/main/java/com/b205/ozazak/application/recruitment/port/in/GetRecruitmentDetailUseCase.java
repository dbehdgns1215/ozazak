package com.b205.ozazak.application.recruitment.port.in;

import com.b205.ozazak.application.recruitment.result.RecruitmentDetailResult;

public interface GetRecruitmentDetailUseCase {
    RecruitmentDetailResult getRecruitmentDetail(Long recruitmentId);
}
