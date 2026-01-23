package com.b205.ozazak.infra.comment.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class CommentJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private CommunityJpaEntity community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountJpaEntity account;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @org.hibernate.annotations.UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    private CommentJpaEntity(CommunityJpaEntity community, AccountJpaEntity account, String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        this.community = community;
        this.account = account;
        this.content = content;
    }

    public static CommentJpaEntity create(CommunityJpaEntity community, AccountJpaEntity account, String content) {
        return new CommentJpaEntity(community, account, content);
    }

    public void updateContent(String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        this.content = content;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
