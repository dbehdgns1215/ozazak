package com.b205.ozazak.infra.block.adapter;

import com.b205.ozazak.application.block.port.out.DeleteBlockPort;
import com.b205.ozazak.application.block.port.out.LoadBlockPort;
import com.b205.ozazak.application.block.port.out.SaveBlockPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.block.entity.Block;
import com.b205.ozazak.domain.block.vo.*;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.block.entity.BlockJpaEntity;
import com.b205.ozazak.infra.block.repository.BlockJpaRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BlockPersistenceAdapter implements LoadBlockPort, SaveBlockPort, DeleteBlockPort {

    private final BlockJpaRepository blockJpaRepository;
    private final EntityManager entityManager;

    // ============ LoadBlockPort ============

    @Override
    public Optional<Block> findById(Long blockId) {
        return blockJpaRepository.findById(blockId)
                .filter(b -> b.getDeletedAt() == null)
                .map(this::toDomain);
    }

    @Override
    public Page<Block> findAllByAccountId(Long accountId, Pageable pageable) {
        return blockJpaRepository.findAllByAccountIdAndDeletedAtIsNull(accountId, pageable)
                .map(this::toDomain);
    }

    @Override
    public Page<Block> findAllByAccountIdAndCategory(Long accountId, Integer category, Pageable pageable) {
        return blockJpaRepository.findAllByAccountIdAndCategoryAndDeletedAtIsNull(accountId, category, pageable)
                .map(this::toDomain);
    }

    @Override
    public Page<Block> searchByKeyword(Long accountId, String keyword, Pageable pageable) {
        return blockJpaRepository.searchByKeyword(accountId, keyword, pageable)
                .map(this::toDomain);
    }

    @Override
    public Page<Block> searchByKeywordAndCategory(Long accountId, String keyword, Integer category, Pageable pageable) {
        return blockJpaRepository.searchByKeywordAndCategory(accountId, keyword, category, pageable)
                .map(this::toDomain);
    }

    // ============ SaveBlockPort ============

    @Override
    public Block save(Block block) {
        // UPDATE: ID가 있는 경우
        if (block.getId() != null && block.getId().value() != null) {
            BlockJpaEntity existing = blockJpaRepository.findById(block.getId().value())
                    .orElseThrow(() -> new IllegalArgumentException("Block not found: " + block.getId().value()));

            existing.updateTitle(block.getTitle().value());
            existing.updateContent(block.getContent().value());
            if (block.getCategories() != null) {
                existing.updateCategories(block.getCategories().value());
            }

            return toDomain(existing);
        }

        // INSERT: 새 블록 생성
        AccountJpaEntity accountRef = entityManager.getReference(
                AccountJpaEntity.class,
                block.getAccount().getId().value()
        );

        BlockJpaEntity newEntity = BlockJpaEntity.create(
                accountRef,
                block.getTitle().value(),
                block.getContent().value(),
                block.getCategories() != null ? block.getCategories().value() : new ArrayList<>(),
                block.getSourceType(),
                block.getSourceTitle() != null ? block.getSourceTitle().getValue() : null
        );

        BlockJpaEntity saved = blockJpaRepository.save(newEntity);
        return toDomain(saved);
    }

    // ============ DeleteBlockPort ============

    @Override
    public void softDelete(Long blockId) {
        BlockJpaEntity entity = blockJpaRepository.findById(blockId)
                .orElseThrow(() -> new IllegalArgumentException("Block not found: " + blockId));
        entity.softDelete();
    }

    // ============ Mapper ============

    private Block toDomain(BlockJpaEntity entity) {
        return Block.builder()
                .id(new BlockId(entity.getBlockId()))
                .account(Account.builder()
                        .id(new AccountId(entity.getAccount().getAccountId()))
                        .build())
                .title(new BlockTitle(entity.getTitle()))
                .content(new BlockContent(entity.getContent()))
                .categories(new Categories(entity.getCategories()))
                .sourceType(entity.getSourceType())
                .sourceTitle(entity.getSourceTitle() != null ? new SourceTitle(entity.getSourceTitle()) : null)
                .deletedAt(entity.getDeletedAt() != null ? new DeletedAt(entity.getDeletedAt()) : null)
                .build();
    }
}
