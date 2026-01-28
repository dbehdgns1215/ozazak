package com.b205.ozazak.infra.recruitment.adapter;

import com.b205.ozazak.application.recruitment.port.out.LoadRecruitmentListPort;
import com.b205.ozazak.application.recruitment.port.out.LoadRecruitmentPort;
import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.company.vo.CompanyId;
import com.b205.ozazak.domain.company.vo.CompanyImg;
import com.b205.ozazak.domain.company.vo.CompanyLocation;
import com.b205.ozazak.domain.company.vo.CompanyName;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import com.b205.ozazak.domain.recruitment.vo.*;
import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import com.b205.ozazak.infra.recruitment.repository.RecruitmentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RecruitmentPersistenceAdapter implements LoadRecruitmentPort, LoadRecruitmentListPort {

    private final RecruitmentJpaRepository recruitmentJpaRepository;

    @Override
    public Optional<Recruitment> loadRecruitment(Long recruitmentId) {
        return recruitmentJpaRepository.findByIdWithCompany(recruitmentId)
                .map(this::toDomain);
    }

    @Override
    public List<Recruitment> loadRecruitmentList(LocalDate from, LocalDate to) {
        return recruitmentJpaRepository.findByDatePeriod(from, to)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Recruitment> loadClosingRecruitments(LocalDate from, LocalDate to) {
        return recruitmentJpaRepository.findClosingRecruitments(from, to)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private Recruitment toDomain(RecruitmentJpaEntity jpa) {
        return Recruitment.builder()
                .id(new RecruitmentId(jpa.getRecruitmentId()))
                .company(Company.builder()
                        .id(new CompanyId(jpa.getCompany().getCompanyId()))
                        .name(new CompanyName(jpa.getCompany().getName()))
                        .img(new CompanyImg(jpa.getCompany().getImg()))
                        .location(new CompanyLocation(jpa.getCompany().getLocation()))
                        .build())
                .title(new RecruitmentTitle(jpa.getTitle()))
                .content(new RecruitmentContent(jpa.getContent()))
                .startedAt(new StartedAt(jpa.getStartedAt()))
                .endedAt(new EndedAt(jpa.getEndedAt()))
                .applyUrl(new ApplyUrl(jpa.getApplyUrl()))
                .createdAt(new CreatedAt(jpa.getCreatedAt()))
                .build();
    }
}
