package com.b205.ozazak.domain.recruitment.entity;

import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.recruitment.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Recruitment {
    private final RecruitmentId id;
    private final Company company;
    private final RecruitmentTitle title;
    private final RecruitmentContent content;
    private final StartedAt startedAt;
    private final EndedAt endedAt;
    private final ApplyUrl applyUrl;
    private final CreatedAt createdAt;
    private final String position;
    private final java.util.List<com.b205.ozazak.domain.question.entity.Question> questions;
}
