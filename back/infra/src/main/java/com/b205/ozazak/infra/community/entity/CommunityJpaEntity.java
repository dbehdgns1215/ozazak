package com.b205.ozazak.infra.community.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "community")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class CommunityJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "community_id")
    private Long communityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountJpaEntity account;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private Integer view;
    
    @Column(name = "community_code")
    private Integer communityCode;
    
    @Column(name = "is_hot")
    private Boolean isHot;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    private CommunityJpaEntity(AccountJpaEntity account, String title, String content, Integer communityCode) {
        validateTitle(title);
        this.account = account;
        this.title = title;
        this.content = content;
        this.view = 0; // Initial view count
        this.communityCode = communityCode;
        this.isHot = false;
    }

    public static CommunityJpaEntity create(AccountJpaEntity account, String title, String content, Integer communityCode) {
        return new CommunityJpaEntity(account, title, content, communityCode);
    }

    public void updateContent(String title, String content) {
        validateTitle(title);
        this.title = title;
        this.content = content;
    }

    public void incrementView() {
        this.view++;
    }

    public void markAsHot() {
        this.isHot = true;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    private void validateTitle(String title) {
        if (title == null || title.isBlank() || title.length() < 5) {
            throw new IllegalArgumentException("Title must be at least 5 characters long");
        }
    }
}
