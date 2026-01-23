package com.b205.ozazak.infra.project.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class ProjectJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountJpaEntity account;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(name = "started_at")
    private LocalDate startedAt;

    @Column(name = "ended_at")
    private LocalDate endedAt;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @org.hibernate.annotations.UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ElementCollection
    @CollectionTable(name = "project_tag", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "name")
    private List<String> tags = new ArrayList<>();

    private ProjectJpaEntity(AccountJpaEntity account, String title, String content, String image, LocalDate startedAt, LocalDate endedAt, List<String> tags) {
        this.account = account;
        this.title = title;
        this.content = content;
        this.image = image;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.tags = tags != null ? tags : new ArrayList<>();
    }

    public static ProjectJpaEntity create(AccountJpaEntity account, String title, String content, String image, LocalDate startedAt, LocalDate endedAt, List<String> tags) {
        return new ProjectJpaEntity(account, title, content, image, startedAt, endedAt, tags);
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
