package com.b205.ozazak.infra.essay.entity;

import com.b205.ozazak.infra.coverletter.entity.CoverletterJpaEntity;
import com.b205.ozazak.infra.question.entity.QuestionJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "essay")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class EssayJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "essay_id")
    private Long essayId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coverletter_id", nullable = false)
    private CoverletterJpaEntity coverletter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuestionJpaEntity question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer version;

    @Column(name = "version_title", nullable = false)
    private String versionTitle;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    private EssayJpaEntity(CoverletterJpaEntity coverletter, QuestionJpaEntity question, String content, Integer version, String versionTitle) {
        this.coverletter = coverletter;
        this.question = question;
        this.content = content;
        this.version = version;
        this.versionTitle = versionTitle;
        this.isCurrent = true;
    }

    public static EssayJpaEntity create(CoverletterJpaEntity coverletter, QuestionJpaEntity question, String content, Integer version, String versionTitle) {
        return new EssayJpaEntity(coverletter, question, content, version, versionTitle);
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
