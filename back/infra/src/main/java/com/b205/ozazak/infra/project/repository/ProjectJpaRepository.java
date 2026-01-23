package com.b205.ozazak.infra.project.repository;

import com.b205.ozazak.infra.project.entity.ProjectJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectJpaRepository extends JpaRepository<ProjectJpaEntity, Long> {
}
