package com.b205.ozazak.infra.streak.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Persistable;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "streak_status")
@Getter
@EntityListeners(AuditingEntityListener.class) // 날짜 자동 주입을 위해 필요
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StreakStatusJpaEntity implements Persistable<Long> { // [중요 1] Persistable 구현

    @Id
    @Column(name = "account_id")
    private Long accountId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "account_id")
    private AccountJpaEntity account;

    @Column(nullable = false)
    private Integer currentStreak;

    @Column(nullable = false)
    private Integer longestStreak;

    @Column(name = "last_activity_date")
    private LocalDate lastActivityDate;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 생성자
    private StreakStatusJpaEntity(AccountJpaEntity account, Integer currentStreak, Integer longestStreak, LocalDate lastActivityDate) {
        this.account = account;
        this.accountId = account.getAccountId(); // [중요 2] ID를 명시적으로 할당해야 함!
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.lastActivityDate = lastActivityDate;
    }

    // Factory Method
    public static StreakStatusJpaEntity create(AccountJpaEntity account, Integer currentStreak, Integer longestStreak, LocalDate lastActivityDate) {
        return new StreakStatusJpaEntity(account, currentStreak, longestStreak, lastActivityDate);
    }

    public void updateStatus(Integer currentStreak, Integer longestStreak, LocalDate lastActivityDate) {
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.lastActivityDate = lastActivityDate;
    }

    @Override
    public Long getId() {
        return this.accountId;
    }

    @Override
    public boolean isNew() {
        // createdAt이 null이면 '새 객체'로 인식 -> 불필요한 조회 없이 바로 INSERT 실행
        return this.createdAt == null;
    }
}