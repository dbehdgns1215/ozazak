package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.application.community.port.out.LoadCommunityPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.*;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.community.vo.*;
import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.company.vo.CompanyId;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CommunityPersistenceAdapter implements LoadCommunityPort {

    private final CommunityJpaRepository communityJpaRepository;

    @Override
    public Optional<Community> loadCommunity(Long communityId) {
        return communityJpaRepository.findById(communityId)
                .map(this::mapToDomain);
    }

    private Community mapToDomain(CommunityJpaEntity entity) {
        return Community.builder()
                .id(new CommunityId(entity.getCommunityId()))
                .author(mapAccount(entity.getAccount()))
                .title(entity.getTitle() != null ? new CommunityTitle(entity.getTitle()) : null)
                .content(entity.getContent() != null ? new CommunityContent(entity.getContent()) : null)
                .view(entity.getView() != null ? new CommunityView(entity.getView()) : null)
                .communityCode(entity.getCommunityCode() != null ? new CommunityCode(entity.getCommunityCode()) : null)
                .isHot(entity.getIsHot() != null ? new IsHot(entity.getIsHot()) : null)
                .createdAt(new CreatedAt(entity.getCreatedAt()))
                .updatedAt(entity.getUpdatedAt() != null ? new UpdatedAt(entity.getUpdatedAt()) : null)
                .build();
    }

    private Account mapAccount(AccountJpaEntity entity) {
        return Account.builder()
                .id(new AccountId(entity.getAccountId()))
                .name(new AccountName(entity.getName()))
                .img(new AccountImg(entity.getImg()))
                .company(entity.getCompanyId() != null ? 
                        Company.builder().id(new CompanyId(entity.getCompanyId())).build() : null)
                .build();
    }
}
