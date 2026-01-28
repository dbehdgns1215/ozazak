package com.b205.ozazak.application.recruitment.port.in;

import com.b205.ozazak.application.recruitment.result.GetRecruitmentListResult;
import com.b205.ozazak.application.recruitment.result.GetRecruitmentResult;

import java.util.List;

public interface GetRecruitmentUseCase {

    // 공고 목록 조회
    List<GetRecruitmentListResult> getRecruitmentList(Long accountId, Integer year, Integer month);

    // 공고 상세 조회
    GetRecruitmentResult getRecruitment(Long recruitmentId, Long accountId);
}
