package com.b205.ozazak.infra.bookmark.repository;

import com.b205.ozazak.infra.bookmark.entity.BookmarkJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookmarkJpaRepository extends JpaRepository<BookmarkJpaEntity, BookmarkJpaEntity.BookmarkId> {
}
