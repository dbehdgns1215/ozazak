package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.application.community.command.UpdateCommunityParams;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.*;
import com.b205.ozazak.application.community.port.out.dto.*;
import com.b205.ozazak.application.community.result.AuthorSummaryResult;
import com.b205.ozazak.application.community.result.CommunitySummaryResult;
import com.b205.ozazak.application.community.result.TilItemResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.account.vo.AccountImg;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.community.vo.*;
import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.company.vo.CompanyId;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import com.b205.ozazak.infra.community.repository.CommunitySummaryJpaResult;
import com.b205.ozazak.infra.community.repository.projection.TilBaseProjection;
import com.b205.ozazak.infra.company.repository.CompanyJpaRepository;
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
    LoadCommunityListPort, 
    LoadTilListPort, 
    DeleteCommunityPort, 
    UpdateCommunityPort, 
    LoadCommunityForUpdatePort,
    LoadCommunityForDeletePort,
    LoadTilExistencePort {

    private final CommunityJpaRepository communityRepository;
    private final AccountJpaRepository accountRepository; // Sometimes used for mapping
    private final CompanyJpaRepository companyRepository; // Used for mapping

    @Override
    public boolean existsActiveTil(Long tilId) {
        // Check ID, communityCode=1 (TIL), not deleted
        return communityRepository.existsByCommunityIdAndCommunityCodeAndDeletedAtIsNull(tilId, 1);
    }

    @Override
    public Optional<Community> loadCommunity(Long communityId) {
        return communityRepository.findByIdWithAuthor(communityId)
                .map(this::mapToDomain);
    }

    // From LoadCommunityPort
    @Override
    public Page<Community> findSummaries(Pageable pageable) {
        Page<CommunitySummaryJpaResult> summaries = communityRepository.findSummaries(pageable);
        
        List<Long> ids = summaries.getContent().stream()
                .map(CommunitySummaryJpaResult::getCommunityId)
                .collect(Collectors.toList());
        
        Map<Long, List<String>> tagMap = fetchTags(ids);
        
        return summaries.map(result -> mapToDomain(result, tagMap.getOrDefault(result.getCommunityId(), Collections.emptyList())));
    }

    // From LoadCommunityListPort
    @Override
    public Page<CommunitySummaryResult> loadCommunitySummaries(Pageable pageable) {
        return communityRepository.findSummaries(pageable)
                .map(jpaResult -> CommunitySummaryResult.builder()
                        .communityId(jpaResult.getCommunityId())
                        .title(jpaResult.getTitle())
                        .author(AuthorSummaryResult.builder()
                                .accountId(jpaResult.getAuthorId())
                                .name(jpaResult.getAuthorName())
                                .img(jpaResult.getAuthorImg())
                                .build())
                        .commentCount(jpaResult.getCommentCount())
                        .build());
    }

    private Map<Long, List<String>> fetchTags(List<Long> ids) {
        if (ids.isEmpty()) return Collections.emptyMap();
        
        List<Object[]> tagResults = communityRepository.findTagsByCommunityIds(ids);
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
        return communityRepository.findAuthorIdById(communityId)
                .map(CommunityAuthorProjection::new)
                .orElse(null);
    }

    @Override
    public void update(Long communityId, UpdateCommunityParams params) {
        CommunityJpaEntity entity = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("Community not found: " + communityId)); 
        
        entity.update(
                params.getCommunityCode(),
                params.getTitle(),
                params.getContent(),
                params.getTags()
        );
        communityRepository.save(entity);
    }

    @Override
    public CommunityDeleteProjection loadForDelete(Long communityId) {
        return communityRepository.findDeleteProjectionById(communityId)
                .orElse(null);
    }

    @Override
    public void delete(Long communityId) {
        int affectedRows = communityRepository.softDelete(communityId);
        if (affectedRows == 0) {
            throw new CommunityException(CommunityErrorCode.NOT_FOUND);
        }
    }

    // ========== TIL List Implementation (2-Step with Order Preservation) ==========
    
    @Override
    public TilListPage loadTilList(ListTilQuery query) {
        
        // STEP 1: Page community IDs with all filters (including conditional tags)
        boolean hasTagFilter = query.tags() != null && !query.tags().isEmpty();
        List<String> tags = hasTagFilter ? query.tags() : Collections.emptyList();
        
        Pageable pageable = org.springframework.data.domain.PageRequest.of(query.page(), query.size());
        Page<Long> idPage = communityRepository.findTilIds(
            query.communityCode(),
            query.authorStatus(),
            query.authorId(),
            tags,
            hasTagFilter,
            pageable
        );
        
        List<Long> communityIds = idPage.getContent();
        
        if (communityIds.isEmpty()) {
            return TilListPage.builder()
                .items(Collections.emptyList())
                .totalElements(0L)
                .totalPages(0)
                .currentPage(query.page())
                .pageSize(query.size())
                .build();
        }
        
        // STEP 2: Fetch base rows by IDs (order NOT preserved by IN clause)
        List<TilBaseProjection> projections = 
            communityRepository.findTilRowsByIds(communityIds);
        
        // CRITICAL: Preserve order from Step 1
        // Build index map: communityId -> original position
        Map<Long, Integer> orderMap = new HashMap<>();
        for (int i = 0; i < communityIds.size(); i++) {
            orderMap.put(communityIds.get(i), i);
        }
        
        // Convert projections to mutable adapter DTOs and sort by original order
        List<TilRow> rows = projections.stream()
            .map(this::projectionToTilRow)
            .sorted(Comparator.comparingInt(row -> orderMap.getOrDefault(row.getCommunityId(), Integer.MAX_VALUE)))
            .collect(Collectors.toList());
        
        // STEP 3: Batch load tags
        Map<Long, List<String>> tagsMap = communityRepository
            .findTagsForTilList(communityIds)
            .stream()
            .collect(Collectors.groupingBy(
                CommunityJpaRepository.TagMapping::getCommunityId,
                Collectors.mapping(
                    CommunityJpaRepository.TagMapping::getTag,
                    Collectors.toList()
                )
            ));
        
        // STEP 4: Batch load comment counts
        Map<Long, Long> commentCountMap = communityRepository
            .findCommentCountsForTilList(communityIds)
            .stream()
            .collect(Collectors.toMap(
                CommunityJpaRepository.CommentCountMapping::getCommunityId,
                CommunityJpaRepository.CommentCountMapping::getCount
            ));
        
        // STEP 5: Batch load reactions
        Map<Long, List<TilItemResult.ReactionInfo>> reactionsMap = 
            communityRepository
                .findReactionsForTilList(communityIds)
                .stream()
                .collect(Collectors.groupingBy(
                    CommunityJpaRepository.ReactionCountMapping::getCommunityId,
                    Collectors.mapping(
                        r -> TilItemResult.ReactionInfo.builder()
                            .type(r.getType())
                            .count(r.getCount())
                            .build(),
                        Collectors.toList()
                    )
                ));
        
        // STEP 6: Merge batch-loaded data into rows
        rows.forEach(row -> {
            Long id = row.getCommunityId();
            row.setTags(tagsMap.getOrDefault(id, Collections.emptyList()));
            row.setCommentCount(commentCountMap.getOrDefault(id, 0L));
            row.setReactions(reactionsMap.getOrDefault(id, Collections.emptyList()));
        });
        
        return TilListPage.builder()
            .items(rows)
            .totalElements(idPage.getTotalElements())
            .totalPages(idPage.getTotalPages())
            .currentPage(idPage.getNumber())
            .pageSize(idPage.getSize())
            .build();
    }
    
    /**
     * Convert read-only projection to mutable adapter DTO
     */
    private TilRow projectionToTilRow(TilBaseProjection p) {
        return TilRow.builder()
            .communityId(p.getCommunityId())
            .title(p.getTitle())
            .content(p.getContent())
            .authorId(p.getAuthorId())
            .authorName(p.getAuthorName())
            .authorImg(p.getAuthorImg())
            .companyName(p.getCompanyName())
            .view(p.getView())
            .createdAt(p.getCreatedAt())
            .build();
    }
}
