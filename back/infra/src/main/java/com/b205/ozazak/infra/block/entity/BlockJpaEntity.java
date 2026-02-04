package com.b205.ozazak.infra.block.entity;

import com.b205.ozazak.domain.block.enums.SourceType;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "block")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class BlockJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "block_id")
    private Long blockId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountJpaEntity account;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "vector", insertable = false, updatable = false)
    private byte[] vector;  // Read-only, actual updates via native query
    
    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", length = 50)
    private SourceType sourceType;
    
    @Column(name = "source_title")
    private String sourceTitle;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ElementCollection
    @CollectionTable(name = "block_category", joinColumns = @JoinColumn(name = "block_id"))
    @Column(name = "code")
    private List<Integer> categories = new ArrayList<>();

    private BlockJpaEntity(AccountJpaEntity account, String title, String content, byte[] vector, List<Integer> categories, SourceType sourceType, String sourceTitle) {
        this.account = account;
        this.title = title;
        this.content = content;
        this.vector = vector;
        this.categories = categories != null ? categories : new ArrayList<>();
        this.sourceType = sourceType;
        this.sourceTitle = sourceTitle;
    }

    public static BlockJpaEntity create(AccountJpaEntity account, String title, String content, byte[] vector, List<Integer> categories, SourceType sourceType, String sourceTitle) {
        return new BlockJpaEntity(account, title, content, vector, categories, sourceType, sourceTitle);
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public void updateTitle(String title) {
        this.title = title;
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void updateCategories(List<Integer> categories) {
        this.categories = categories != null ? new ArrayList<>(categories) : new ArrayList<>();
    }
}
