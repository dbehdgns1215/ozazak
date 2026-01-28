package com.b205.ozazak.infra.resume.adapter;

import com.b205.ozazak.application.resume.port.ResumePersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.resume.entity.Resume;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.resume.entity.ResumeJpaEntity;
import com.b205.ozazak.infra.resume.mapper.ResumeMapper;
import com.b205.ozazak.infra.resume.repository.ResumeJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ResumePersistenceAdapter implements ResumePersistencePort {
    private final ResumeJpaRepository resumeJpaRepository;
    private final AccountJpaRepository accountJpaRepository;

    @Override
    public Resume save(Resume resume) {
        AccountJpaEntity accountJpaEntity = accountJpaRepository.getReferenceById(resume.getAccount().getId().value());
        ResumeJpaEntity jpaEntity = ResumeMapper.toJpa(resume, accountJpaEntity);
        ResumeJpaEntity savedEntity = resumeJpaRepository.save(jpaEntity);
        
        return ResumeMapper.toDomain(savedEntity, resume.getAccount());
    }

    @Override
    public List<Resume> findByAccountId(Long accountId) {
        AccountJpaEntity accountJpaEntity = accountJpaRepository.getReferenceById(accountId);
        
        return resumeJpaRepository.findByAccount_AccountIdOrderByStartedAtDesc(accountId)
            .stream()
            .map(jpaEntity -> ResumeMapper.toDomain(jpaEntity, toAccount(accountJpaEntity)))
            .toList();
    }

    private Account toAccount(AccountJpaEntity jpaEntity) {
        return Account.builder()
            .id(new com.b205.ozazak.domain.account.vo.AccountId(jpaEntity.getAccountId()))
            .build();
    }
}
