package com.b205.ozazak.application.recruitment.port.out;

import com.b205.ozazak.domain.recruitment.entity.Recruitment;

import java.time.LocalDate;
import java.util.List;

public interface LoadRecruitmentListPort {
    List<Recruitment> loadRecruitmentList(LocalDate from, LocalDate to);

    List<Recruitment> loadClosingRecruitments(LocalDate from, LocalDate to);
}
