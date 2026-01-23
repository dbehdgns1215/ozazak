package com.b205.ozazak.infra.block.repository;

import com.b205.ozazak.infra.block.entity.BlockJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlockJpaRepository extends JpaRepository<BlockJpaEntity, Long> {
}
