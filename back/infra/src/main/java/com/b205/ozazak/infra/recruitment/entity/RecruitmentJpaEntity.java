package com.b205.ozazak.infra.recruitment.entity;

import com.b205.ozazak.infra.company.entity.CompanyJpaEntity;
import jakarta.persistence.*;
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
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "apply_url")
    private String applyUrl;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private String position;

    @OneToMany(mappedBy = "recruitment", fetch = FetchType.LAZY)
    private java.util.List<com.b205.ozazak.infra.question.entity.QuestionJpaEntity> questions = new java.util.ArrayList<>();
}
