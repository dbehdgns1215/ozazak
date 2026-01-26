package com.b205.ozazak.infra.coverletter.adapter;

import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
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
import com.b205.ozazak.infra.coverletter.entity.CoverletterJpaEntity;
import com.b205.ozazak.infra.coverletter.repository.CoverletterJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CoverletterPersistenceAdapter implements LoadCoverletterPort {

    private final CoverletterJpaRepository coverletterJpaRepository;

    @Override
    public Page<Coverletter> findByAccountId(Long accountId, Pageable pageable) {
        Page<CoverletterJpaEntity> jpaEntities = coverletterJpaRepository
                .findByAccountIdWithRecruitmentAndCompany(accountId, pageable);
        
        return jpaEntities.map(this::toDomain);
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
                .jobType(entity.getRecruitment().getJobTypeCode() != null ? JobType.fromCode(entity.getRecruitment().getJobTypeCode()) : null)
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
}
