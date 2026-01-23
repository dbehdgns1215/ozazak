package com.b205.ozazak.infra.follow.repository;

import com.b205.ozazak.infra.follow.entity.FollowJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowJpaRepository extends JpaRepository<FollowJpaEntity, FollowJpaEntity.FollowId> {
}
