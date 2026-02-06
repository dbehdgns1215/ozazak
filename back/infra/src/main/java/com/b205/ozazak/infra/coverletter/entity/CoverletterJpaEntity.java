package com.b205.ozazak.infra.coverletter.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;

@Entity
@Table(name = "coverletter")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class CoverletterJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coverletter_id")
    private Long coverletterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountJpaEntity account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id", nullable = false)
    private RecruitmentJpaEntity recruitment;

    private String title;

    @Column(name = "is_complete")
    private Boolean isComplete;

    @Column(name = "is_passed")
    private Boolean isPassed;

    public Boolean getIsComplete() {
        return this.isComplete;
    }

    public Boolean getIsPassed() {
        return this.isPassed;
    }

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @org.hibernate.annotations.UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    private CoverletterJpaEntity(AccountJpaEntity account, RecruitmentJpaEntity recruitment, String title, Boolean isComplete) {
        this.account = account;
        this.recruitment = recruitment;
        this.title = title;
        this.isComplete = isComplete != null ? isComplete : false;
    }

    public static CoverletterJpaEntity create(AccountJpaEntity account, RecruitmentJpaEntity recruitment,
            String title, Boolean isComplete) {
        return new CoverletterJpaEntity(account, recruitment, title, isComplete);
    }

    public void updateTitle(String title) {
        this.title = title;
    }

    public void complete() {
        this.isComplete = true;
    }

    public void markPassed(Boolean isPassed) {
        this.isPassed = isPassed;
    }

    public void updateIsComplete(Boolean isComplete) {
        this.isComplete = isComplete;
    }

    public void updateIsPassed(Boolean isPassed) {
        this.isPassed = isPassed;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
