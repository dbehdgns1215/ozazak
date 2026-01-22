package com.b205.ozazak.domain.question.entity;

import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import com.b205.ozazak.domain.question.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Question {
    private final QuestionId id;
    private final Company company;
    private final Recruitment recruitment;
    private final QuestionContent content;
    private final OrderValue orderValue;
    private final CharMax charMax;
}
