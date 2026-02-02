package com.b205.ozazak.infra.activity.repository;

import com.b205.ozazak.infra.activity.entity.ActivityJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityJpaRepository extends JpaRepository<ActivityJpaEntity, Long> {
    List<ActivityJpaEntity> findByAccount_AccountIdAndCodeOrderByAwardedAtDescActivityIdDesc(Long accountId, Integer code);
}
