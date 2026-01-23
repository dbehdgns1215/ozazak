package com.b205.ozazak.infra.company.repository;

import com.b205.ozazak.infra.company.entity.CompanyJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyJpaRepository extends JpaRepository<CompanyJpaEntity, Long> {
}
