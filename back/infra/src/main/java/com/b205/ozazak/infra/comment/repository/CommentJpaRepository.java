package com.b205.ozazak.infra.comment.repository;

import com.b205.ozazak.infra.comment.entity.CommentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentJpaRepository extends JpaRepository<CommentJpaEntity, Long> {
}
