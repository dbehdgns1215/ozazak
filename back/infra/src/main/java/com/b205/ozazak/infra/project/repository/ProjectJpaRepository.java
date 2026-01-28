package com.b205.ozazak.infra.project.repository;

import com.b205.ozazak.infra.project.entity.ProjectJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectJpaRepository extends JpaRepository<ProjectJpaEntity, Long> {

    // 프로젝트 목록 조회
    @Query("SELECT p FROM ProjectJpaEntity p WHERE p.accountId = :accountId AND p.deletedAt IS NULL ORDER BY p.createdAt DESC")
    Page<ProjectJpaEntity> findProjectJpaEntitiesByAccountId(@Param("accountId") Long accountId, Pageable pageable);

    // 프로젝트 상세 조회
    @Query("SELECT p FROM ProjectJpaEntity p WHERE p.projectId = :id AND p.deletedAt IS NULL")
    Optional<ProjectJpaEntity> findProjectJpaEntityByProjectId(@Param("id") Long id);
}
