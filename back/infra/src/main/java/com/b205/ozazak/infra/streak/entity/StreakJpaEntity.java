package com.b205.ozazak.infra.streak.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "streak")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@IdClass(StreakId.class)
public class StreakJpaEntity {
    @Id
    @Column(name = "account_id")
    private Long accountId;

    @Id
    @Column(name = "activity_date")
    private LocalDate activityDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", insertable = false, updatable = false)
    private AccountJpaEntity account;

    @Column(nullable = false)
    private Integer dailyCount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    private StreakJpaEntity(AccountJpaEntity account, LocalDate activityDate, Integer dailyCount) {
        this.accountId = account.getAccountId();
        this.account = account;
        this.activityDate = activityDate;
        this.dailyCount = dailyCount;
    }

    public static StreakJpaEntity create(AccountJpaEntity account, LocalDate activityDate, Integer dailyCount) {
        return new StreakJpaEntity(account, activityDate, dailyCount);
    }

    public void updateDailyCount(Integer dailyCount) {
        this.dailyCount = dailyCount;
    }
}

