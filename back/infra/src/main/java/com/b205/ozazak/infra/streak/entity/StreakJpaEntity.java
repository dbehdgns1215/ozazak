package com.b205.ozazak.infra.streak.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "streak")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class StreakJpaEntity {
    @Id
    private Long accountId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "account_id")
    private AccountJpaEntity account;

    @Column(nullable = false)
    private Integer cnt;

    @org.hibernate.annotations.UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    private StreakJpaEntity(AccountJpaEntity account, Integer cnt) {
        this.account = account;
        this.cnt = cnt;
    }

    public static StreakJpaEntity create(AccountJpaEntity account, Integer cnt) {
        return new StreakJpaEntity(account, cnt);
    }

    public void updateCount(Integer cnt) {
        this.cnt = cnt;
    }
}
