package com.b205.ozazak.application.recruitment.port.out;

import com.b205.ozazak.domain.recruitment.entity.Recruitment;

import java.util.Optional;

public interface LoadRecruitmentPort {
    Optional<Recruitment> loadRecruitment(Long recruitmentId);
}
