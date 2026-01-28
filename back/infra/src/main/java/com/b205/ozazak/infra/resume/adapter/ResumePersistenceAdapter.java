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
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ResumePersistenceAdapter implements ResumePersistencePort {
    private final ResumeJpaRepository resumeJpaRepository;
    private final AccountJpaRepository accountJpaRepository;

    @Override
    public Resume save(Resume resume) {
        AccountJpaEntity accountJpaEntity = accountJpaRepository.getReferenceById(resume.getAccount().getId().value());
        
        // 기존 ID가 있으면 UPDATE, 없으면 INSERT
        if (resume.getId() != null && resume.getId().value() != null) {
            // UPDATE: 기존 entity 조회 후 수정
            ResumeJpaEntity existingEntity = resumeJpaRepository.findById(resume.getId().value())
                .orElseThrow(() -> new IllegalArgumentException("Resume not found for update"));
            
            existingEntity.update(
                resume.getTitle().value(),
                resume.getContent().value(),
                resume.getStartedAt().value(),
                resume.getEndedAt() != null ? resume.getEndedAt().value() : null
            );
            
            ResumeJpaEntity savedEntity = resumeJpaRepository.save(existingEntity);
            return ResumeMapper.toDomain(savedEntity, resume.getAccount());
        } else {
            // INSERT: 새로운 entity 생성
            ResumeJpaEntity jpaEntity = ResumeJpaEntity.create(
                accountJpaEntity,
                resume.getTitle().value(),
                resume.getContent().value(),
                resume.getStartedAt().value(),
                resume.getEndedAt() != null ? resume.getEndedAt().value() : null
            );
            
            ResumeJpaEntity savedEntity = resumeJpaRepository.save(jpaEntity);
            return ResumeMapper.toDomain(savedEntity, resume.getAccount());
        }
    }

    @Override
    public List<Resume> findByAccountId(Long accountId) {
        AccountJpaEntity accountJpaEntity = accountJpaRepository.getReferenceById(accountId);
        
        return resumeJpaRepository.findByAccount_AccountIdOrderByStartedAtDesc(accountId)
            .stream()
            .map(jpaEntity -> ResumeMapper.toDomain(jpaEntity, toAccount(accountJpaEntity)))
            .toList();
    }

    @Override
    public Optional<Resume> findById(Long resumeId) {
        return resumeJpaRepository.findById(resumeId)
            .map(jpaEntity -> {
                Account account = toAccount(jpaEntity.getAccount());
                return ResumeMapper.toDomain(jpaEntity, account);
            });
    }

    private Account toAccount(AccountJpaEntity jpaEntity) {
        return Account.builder()
            .id(new com.b205.ozazak.domain.account.vo.AccountId(jpaEntity.getAccountId()))
            .build();
    }
}
