package com.b205.ozazak.application.question.port.out;

import com.b205.ozazak.domain.question.entity.Question;

import java.util.List;

public interface LoadQuestionPort {
    List<Question> findAllByRecruitmentId(Long recruitmentId);
}
