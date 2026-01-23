package com.b205.ozazak.infra.activity.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "activity")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class ActivityJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Long activityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountJpaEntity account;

    private String title;
    
    private Integer code;
    
    @Column(name = "rank_name")
    private String rankName;
    
    private String organization;
    
    @Column(name = "awarded_at")
    private LocalDate awardedAt;

    private ActivityJpaEntity(AccountJpaEntity account, String title, Integer code, String rankName, String organization, LocalDate awardedAt) {
        this.account = account;
        this.title = title;
        this.code = code;
        this.rankName = rankName;
        this.organization = organization;
        this.awardedAt = awardedAt;
    }

    public static ActivityJpaEntity create(AccountJpaEntity account, String title, Integer code, String rankName, String organization, LocalDate awardedAt) {
        return new ActivityJpaEntity(account, title, code, rankName, organization, awardedAt);
    }
}
