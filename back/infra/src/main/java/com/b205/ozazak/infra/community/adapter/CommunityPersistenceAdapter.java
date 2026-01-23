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
import com.b205.ozazak.infra.community.repository.CommunitySummaryJpaResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CommunityPersistenceAdapter implements LoadCommunityPort {

    private final CommunityJpaRepository communityJpaRepository;

    @Override
    public Optional<Community> loadCommunity(Long communityId) {
        return communityJpaRepository.findByIdWithAuthor(communityId)
                .map(this::mapToDomain);
    }

    @Override
    public Page<Community> findSummaries(Pageable pageable) {
        Page<CommunitySummaryJpaResult> summaries = communityJpaRepository.findSummaries(pageable);
        
        List<Long> ids = summaries.getContent().stream()
                .map(CommunitySummaryJpaResult::getCommunityId)
                .collect(Collectors.toList());
        
        Map<Long, List<String>> tagMap = fetchTags(ids);
        
        return summaries.map(result -> mapToDomain(result, tagMap.getOrDefault(result.getCommunityId(), Collections.emptyList())));
    }

    private Map<Long, List<String>> fetchTags(List<Long> ids) {
        if (ids.isEmpty()) return Collections.emptyMap();
        
        List<Object[]> tagResults = communityJpaRepository.findTagsByCommunityIds(ids);
        return tagResults.stream()
                .collect(Collectors.groupingBy(
                        row -> ((Number) row[0]).longValue(),
                        Collectors.mapping(row -> (String) row[1], Collectors.toList())
                ));
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

    private Community mapToDomain(CommunitySummaryJpaResult result, List<String> tags) {
        return Community.builder()
                .id(new CommunityId(result.getCommunityId()))
                .author(Account.builder()
                        .id(new AccountId(result.getAuthorId()))
                        .name(new AccountName(result.getAuthorName()))
                        .img(new AccountImg(result.getAuthorImg()))
                        .build())
                .title(result.getTitle() != null ? new CommunityTitle(result.getTitle()) : null)
                .view(result.getView() != null ? new CommunityView(result.getView()) : null)
                .communityCode(result.getCommunityCode() != null ? new CommunityCode(result.getCommunityCode()) : null)
                .isHot(result.getIsHot() != null ? new IsHot(result.getIsHot()) : null)
                .createdAt(new CreatedAt(result.getCreatedAt()))
                .tags(tags)
                .commentCount(result.getCommentCount())
                .reactionCount(result.getReactionCount())
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
