package com.b205.ozazak.infra.recruitment.entity;

import com.b205.ozazak.infra.company.entity.CompanyJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recruitment")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class RecruitmentJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recruitment_id")
    private Long recruitmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyJpaEntity company;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "started_at")
    private LocalDate startedAt;

    @Column(name = "ended_at")
    private LocalDate endedAt;

    @Column(name = "apply_url")
    private String applyUrl;

    @Column(name = "job_type")
    private Integer jobTypeCode;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private RecruitmentJpaEntity(CompanyJpaEntity company, String title, String content, LocalDate startedAt, LocalDate endedAt, String applyUrl, Integer jobTypeCode) {
        this.company = company;
        this.title = title;
        this.content = content;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.applyUrl = applyUrl;
        this.jobTypeCode = jobTypeCode;
    }

    public static RecruitmentJpaEntity create(CompanyJpaEntity company, String title, String content, LocalDate startedAt, LocalDate endedAt, String applyUrl, Integer jobTypeCode) {
        return new RecruitmentJpaEntity(company, title, content, startedAt, endedAt, applyUrl, jobTypeCode);
    }
}
