package com.b205.ozazak.infra.block.entity;

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
    
    private byte[] vector;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ElementCollection
    @CollectionTable(name = "block_category", joinColumns = @JoinColumn(name = "block_id"))
    @Column(name = "code")
    private List<Integer> categories = new ArrayList<>();

    private BlockJpaEntity(AccountJpaEntity account, String title, String content, byte[] vector, List<Integer> categories) {
        this.account = account;
        this.title = title;
        this.content = content;
        this.vector = vector;
        this.categories = categories != null ? categories : new ArrayList<>();
    }

    public static BlockJpaEntity create(AccountJpaEntity account, String title, String content, byte[] vector, List<Integer> categories) {
        return new BlockJpaEntity(account, title, content, vector, categories);
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
