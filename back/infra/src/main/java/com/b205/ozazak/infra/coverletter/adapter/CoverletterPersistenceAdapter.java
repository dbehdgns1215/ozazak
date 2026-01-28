package com.b205.ozazak.infra.coverletter.adapter;

import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
import com.b205.ozazak.application.coverletter.port.out.SaveCoverletterPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.account.vo.AccountImg;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.company.vo.CompanyId;
import com.b205.ozazak.domain.company.vo.CompanyImg;
import com.b205.ozazak.domain.company.vo.CompanyLocation;
import com.b205.ozazak.domain.company.vo.CompanyName;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.coverletter.vo.*;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import com.b205.ozazak.domain.recruitment.vo.*;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.coverletter.entity.CoverletterJpaEntity;
import com.b205.ozazak.infra.coverletter.repository.CoverletterJpaRepository;
import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CoverletterPersistenceAdapter implements LoadCoverletterPort, SaveCoverletterPort {

    private final CoverletterJpaRepository coverletterJpaRepository;
    private final EntityManager entityManager;

    @Override
    public Page<Coverletter> findByAccountId(Long accountId, Pageable pageable) {
        Page<CoverletterJpaEntity> jpaEntities = coverletterJpaRepository
                .findByAccountIdWithRecruitmentAndCompany(accountId, pageable);
        
        return jpaEntities.map(this::toDomain);
    }

    @Override
    public java.util.Optional<Coverletter> findByIdAndAccountId(Long coverletterId, Long accountId) {
        return coverletterJpaRepository.findByCoverletterIdAndAccount_AccountIdAndDeletedAtIsNull(coverletterId, accountId)
                .map(this::toDomain);
    }

    @Override
    public java.util.Optional<Coverletter> findByAccountIdAndRecruitmentId(Long accountId, Long recruitmentId) {
        return coverletterJpaRepository.findByAccountIdAndRecruitmentId(accountId, recruitmentId)
                .map(this::toDomain);
    }

    @Override
    public java.util.Optional<Coverletter> findById(Long coverletterId) {
        return coverletterJpaRepository.findById(coverletterId)
                .filter(c -> c.getDeletedAt() == null)
                .map(this::toDomain);
    }

    @Override
    public Coverletter save(Coverletter coverletter) {
        // ID가 있으면 기존 엔티티 업데이트
        if (coverletter.getId() != null && coverletter.getId().value() != null) {
            CoverletterJpaEntity existing = coverletterJpaRepository
                    .findById(coverletter.getId().value())
                    .orElseThrow(() -> new IllegalArgumentException("Coverletter not found: " + coverletter.getId().value()));
            
            existing.updateTitle(coverletter.getTitle().value());
            existing.updateIsComplete(coverletter.getIsComplete().value());
            existing.updateIsPassed(coverletter.getIsPassed().value());
            
            return toDomain(existing);
        }
        
        // 새 엔티티 생성
        CoverletterJpaEntity jpaEntity = toJpaEntity(coverletter);
        CoverletterJpaEntity saved = coverletterJpaRepository.save(jpaEntity);
        return toDomain(saved);
    }

    private Coverletter toDomain(CoverletterJpaEntity entity) {
        return Coverletter.builder()
                .id(new CoverletterId(entity.getCoverletterId()))
                .account(mapAccount(entity))
                .recruitment(mapRecruitment(entity))
                .title(new CoverletterTitle(entity.getTitle()))
                .isComplete(new IsComplete(entity.getIsComplete()))
                .isPassed(new IsPassed(entity.getIsPassed()))
                .createdAt(new com.b205.ozazak.domain.coverletter.vo.CreatedAt(entity.getCreatedAt()))
                .updatedAt(entity.getUpdatedAt() != null ? new com.b205.ozazak.domain.coverletter.vo.UpdatedAt(entity.getUpdatedAt()) : null)
                .deletedAt(entity.getDeletedAt() != null ? new DeletedAt(entity.getDeletedAt()) : null)
                .build();
    }

    private Account mapAccount(CoverletterJpaEntity entity) {
        if (entity.getAccount() == null) {
            return null;
        }
        return Account.builder()
                .id(new AccountId(entity.getAccount().getAccountId()))
                .email(new com.b205.ozazak.domain.account.vo.Email(entity.getAccount().getEmail()))
                .password(new com.b205.ozazak.domain.account.vo.Password(entity.getAccount().getPassword()))
                .name(new AccountName(entity.getAccount().getName()))
                .img(new AccountImg(entity.getAccount().getImg()))
                .roleCode(entity.getAccount().getRoleCode())
                .build();
    }

    private Recruitment mapRecruitment(CoverletterJpaEntity entity) {
        if (entity.getRecruitment() == null) {
            return null;
        }
        
        return Recruitment.builder()
                .id(new RecruitmentId(entity.getRecruitment().getRecruitmentId()))
                .company(mapCompany(entity))
                .title(entity.getRecruitment().getTitle() != null ? new RecruitmentTitle(entity.getRecruitment().getTitle()) : null)
                .content(entity.getRecruitment().getContent() != null ? new RecruitmentContent(entity.getRecruitment().getContent()) : null)
                .startedAt(entity.getRecruitment().getStartedAt() != null ? new com.b205.ozazak.domain.recruitment.vo.StartedAt(entity.getRecruitment().getStartedAt()) : null)
                .endedAt(entity.getRecruitment().getEndedAt() != null ? new com.b205.ozazak.domain.recruitment.vo.EndedAt(entity.getRecruitment().getEndedAt()) : null)
                .applyUrl(entity.getRecruitment().getApplyUrl() != null ? new ApplyUrl(entity.getRecruitment().getApplyUrl()) : null)
                .createdAt(new com.b205.ozazak.domain.recruitment.vo.CreatedAt(entity.getRecruitment().getCreatedAt()))
                .build();
    }

    private Company mapCompany(CoverletterJpaEntity entity) {
        if (entity.getRecruitment() == null || entity.getRecruitment().getCompany() == null) {
            return null;
        }
        
        return Company.builder()
                .id(new CompanyId(entity.getRecruitment().getCompany().getCompanyId()))
                .name(entity.getRecruitment().getCompany().getName() != null ? new CompanyName(entity.getRecruitment().getCompany().getName()) : null)
                .img(entity.getRecruitment().getCompany().getImg() != null ? new CompanyImg(entity.getRecruitment().getCompany().getImg()) : null)
                .location(entity.getRecruitment().getCompany().getLocation() != null ? new CompanyLocation(entity.getRecruitment().getCompany().getLocation()) : null)
                .build();
    }

    private CoverletterJpaEntity toJpaEntity(Coverletter coverletter) {
        // Use EntityManager.getReference() for FK optimization
        AccountJpaEntity accountRef = entityManager.getReference(
                AccountJpaEntity.class,
                coverletter.getAccount().getId().value()
        );

        // recruitment는 nullable
        RecruitmentJpaEntity recruitmentRef = null;
        if (coverletter.getRecruitment() != null && coverletter.getRecruitment().getId() != null) {
            recruitmentRef = entityManager.getReference(
                    RecruitmentJpaEntity.class,
                    coverletter.getRecruitment().getId().value()
            );
        }

        return CoverletterJpaEntity.create(
                accountRef,
                recruitmentRef,
                coverletter.getTitle().value()
        );
    }
}
