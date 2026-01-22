package com.b205.ozazak.infra.community.repository;

import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityJpaRepository extends JpaRepository<CommunityJpaEntity, Long> {
}
