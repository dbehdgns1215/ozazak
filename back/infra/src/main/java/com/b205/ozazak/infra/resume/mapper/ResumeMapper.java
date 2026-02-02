package com.b205.ozazak.infra.resume.mapper;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.resume.entity.Resume;
import com.b205.ozazak.domain.resume.vo.*;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.resume.entity.ResumeJpaEntity;

public class ResumeMapper {
    public static Resume toDomain(ResumeJpaEntity jpaEntity, Account account) {
        if (jpaEntity == null) {
            return null;
        }
        
        return Resume.builder()
            .id(new ResumeId(jpaEntity.getResumeId()))
            .account(account)
            .title(new ResumeTitle(jpaEntity.getTitle()))
            .content(new ResumeContent(jpaEntity.getContent()))
            .startedAt(new StartedAt(jpaEntity.getStartedAt()))
            .endedAt(jpaEntity.getEndedAt() != null ? new EndedAt(jpaEntity.getEndedAt()) : null)
            .build();
    }

    public static ResumeJpaEntity toJpa(Resume domainEntity, AccountJpaEntity accountJpaEntity) {
        if (domainEntity == null) {
            return null;
        }
        
        return ResumeJpaEntity.create(
            accountJpaEntity,
            domainEntity.getTitle().value(),
            domainEntity.getContent().value(),
            domainEntity.getStartedAt().value(),
            domainEntity.getEndedAt() != null ? domainEntity.getEndedAt().value() : null
        );
    }
}
