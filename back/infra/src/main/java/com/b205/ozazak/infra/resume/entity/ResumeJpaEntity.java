package com.b205.ozazak.infra.resume.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "resume")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class ResumeJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_id")
    private Long resumeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountJpaEntity account;

    @Column(nullable = false)
    private String title;

    private String content;

    @Column(name = "started_at")
    private LocalDate startedAt;

    @Column(name = "ended_at")
    private LocalDate endedAt;

    private ResumeJpaEntity(AccountJpaEntity account, String title, String content, LocalDate startedAt, LocalDate endedAt) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Resume title cannot be empty");
        }
        this.account = account;
        this.title = title;
        this.content = content;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }

    public static ResumeJpaEntity create(AccountJpaEntity account, String title, String content, LocalDate startedAt, LocalDate endedAt) {
        return new ResumeJpaEntity(account, title, content, startedAt, endedAt);
    }

    // UPDATE 메서드
    public void update(String title, String content, LocalDate startedAt, LocalDate endedAt) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Resume title cannot be empty");
        }
        this.title = title;
        this.content = content;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }
}
