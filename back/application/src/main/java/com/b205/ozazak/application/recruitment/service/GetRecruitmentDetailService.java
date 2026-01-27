package com.b205.ozazak.application.recruitment.service;

import com.b205.ozazak.application.question.port.out.LoadQuestionPort;
import com.b205.ozazak.application.recruitment.port.in.GetRecruitmentDetailUseCase;
import com.b205.ozazak.application.recruitment.port.out.LoadRecruitmentPort;
import com.b205.ozazak.application.recruitment.result.RecruitmentDetailResult;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetRecruitmentDetailService implements GetRecruitmentDetailUseCase {

    private final LoadRecruitmentPort loadRecruitmentPort;
    private final LoadQuestionPort loadQuestionPort;

    @Override
    public RecruitmentDetailResult getRecruitmentDetail(Long recruitmentId) {
        Recruitment recruitment = loadRecruitmentPort.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("Recruitment not found: " + recruitmentId));

        List<Question> questions = loadQuestionPort.findAllByRecruitmentId(recruitmentId);

        return RecruitmentDetailResult.from(recruitment, questions);
    }
}
