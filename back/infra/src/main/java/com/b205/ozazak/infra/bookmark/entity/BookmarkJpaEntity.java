package com.b205.ozazak.infra.bookmark.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookmark")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@IdClass(BookmarkJpaEntity.BookmarkId.class)
public class BookmarkJpaEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private AccountJpaEntity account;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id")
    private RecruitmentJpaEntity recruitment;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private BookmarkJpaEntity(AccountJpaEntity account, RecruitmentJpaEntity recruitment) {
        this.account = account;
        this.recruitment = recruitment;
    }

    public static BookmarkJpaEntity create(AccountJpaEntity account, RecruitmentJpaEntity recruitment) {
        return new BookmarkJpaEntity(account, recruitment);
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class BookmarkId implements Serializable {
        private Long account;
        private Long recruitment;
    }
}
