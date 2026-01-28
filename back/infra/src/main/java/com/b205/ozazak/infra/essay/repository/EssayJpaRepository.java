package com.b205.ozazak.infra.essay.repository;

import com.b205.ozazak.infra.essay.entity.EssayJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EssayJpaRepository extends JpaRepository<EssayJpaEntity, Long> {
    
    @Query("SELECT e FROM EssayJpaEntity e " +
           "JOIN FETCH e.question " +
           "WHERE e.coverletter.coverletterId = :coverletterId " +
           "AND e.deletedAt IS NULL")
    List<EssayJpaEntity> findByCoverletter_CoverletterIdAndDeletedAtIsNull(@Param("coverletterId") Long coverletterId);

    @Query("SELECT e FROM EssayJpaEntity e " +
           "JOIN FETCH e.question " +
           "WHERE e.coverletter.coverletterId = :coverletterId " +
           "AND e.question.questionId = :questionId " +
           "AND e.deletedAt IS NULL")
    List<EssayJpaEntity> findByCoverletter_CoverletterIdAndQuestion_QuestionIdAndDeletedAtIsNull(
            @Param("coverletterId") Long coverletterId,
            @Param("questionId") Long questionId
    );
}
