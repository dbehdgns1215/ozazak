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
import com.b205.ozazak.application.community.port.out.LoadCommunityForUpdatePort;
import com.b205.ozazak.application.community.port.out.UpdateCommunityPort;
import com.b205.ozazak.application.community.port.out.CommunityAuthorProjection;
import com.b205.ozazak.application.community.port.out.LoadCommunityForDeletePort;
import com.b205.ozazak.application.community.port.out.DeleteCommunityPort;
import com.b205.ozazak.application.community.port.out.CommunityDeleteProjection;
import com.b205.ozazak.application.community.command.UpdateCommunityParams;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CommunityPersistenceAdapter implements 
        LoadCommunityPort, 
        LoadCommunityForUpdatePort, 
        UpdateCommunityPort,
        LoadCommunityForDeletePort,
        DeleteCommunityPort {

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

    @Override
    public CommunityAuthorProjection loadForUpdate(Long communityId) {
        return communityJpaRepository.findAuthorIdById(communityId)
                .map(CommunityAuthorProjection::new)
                .orElse(null);
    }

    @Override
    public void update(Long communityId, UpdateCommunityParams params) {
        CommunityJpaEntity entity = communityJpaRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("Community not found: " + communityId)); // Should verify if we want to throw distinct exception here, but Service handles 404 check before calling update in strict sense? 
                // Actually Service calls loadForUpdate first. If successful, then calls update. So entity should exist.
                // But generally safe to throw exception or just .get().
        
        entity.update(
                params.getCommunityCode(),
                params.getTitle(),
                params.getContent(),
                params.getTags()
        );
        // Transactional service will commit changes. explicit save not always needed but good practice.
        communityJpaRepository.save(entity);
    }

    @Override
    public CommunityDeleteProjection loadForDelete(Long communityId) {
        return communityJpaRepository.findDeleteProjectionById(communityId)
                .orElse(null);
    }

    @Override
    public void delete(Long communityId) {
        int affectedRows = communityJpaRepository.softDelete(communityId);
        if (affectedRows == 0) {
            throw new CommunityException(CommunityErrorCode.NOT_FOUND);
        }
    }
}
