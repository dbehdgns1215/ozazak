package com.b205.ozazak.infra.question.repository;

import com.b205.ozazak.infra.question.entity.QuestionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionJpaRepository extends JpaRepository<QuestionJpaEntity, Long> {
}
