package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.*;
import com.b205.ozazak.application.community.port.out.dto.*;
import com.b205.ozazak.application.community.port.out.model.CategoryStat;
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
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import com.b205.ozazak.infra.community.repository.CommunitySummaryJpaResult;
import com.b205.ozazak.infra.community.repository.projection.CommunityListProjection;
import com.b205.ozazak.infra.community.repository.projection.TilBaseProjection;
import com.b205.ozazak.infra.community.repository.projection.TotalCountProjection;
import com.b205.ozazak.infra.community.repository.projection.TodayCountProjection;
import com.b205.ozazak.infra.company.repository.CompanyJpaRepository;
import com.b205.ozazak.infra.reaction.repository.ReactionJpaRepository;
import com.b205.ozazak.infra.reaction.repository.projection.UserReactionProjection;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CommunityPersistenceAdapter implements 
    LoadCommunityPort, 
    LoadCommunityListPort, 
    LoadTilListPort, 
    DeleteCommunityPort, 
    // UpdateCommunityPort, // Removed
    // LoadCommunityForUpdatePort, // Removed
    LoadCommunityForDeletePort,
    LoadTilExistencePort,
    LoadCommunityCategoryStatsPort,
    LoadCommunityDetailPort,
    IncrementCommunityViewPort,
    SaveCommunityPort {

    private final CommunityJpaRepository communityRepository;
    private final CompanyJpaRepository companyRepository;
    private final ReactionJpaRepository reactionRepository;
    private final EntityManager entityManager;

    // =============================================================
    // Domain & Existence Check
    // =============================================================

    @Override
    public boolean existsActiveTil(Long tilId) {
        return communityRepository.existsByCommunityIdAndCommunityCodeAndDeletedAtIsNull(tilId, 1);
    }

    @Override
    public Optional<Community> loadCommunity(Long communityId) {
        return communityRepository.findByIdWithAuthor(communityId)
                .map(this::mapToDomain);
    }

    // =============================================================
    // Command (Save / Delete)
    // =============================================================

    @Override
    public Long save(Community community) {
        if (community.getId() != null && community.getId().value() != null) {
            // Update Existing
            CommunityJpaEntity entity = communityRepository.findById(community.getId().value())
                    .orElseThrow(() -> new CommunityException(CommunityErrorCode.NOT_FOUND));

            entity.update(
                    community.getCommunityCode().value(),
                    community.getTitle().value(),
                    community.getContent().value(),
                    community.getTags()
            );
            return communityRepository.save(entity).getCommunityId();
        } else {
            // Create New
            AccountJpaEntity accountRef = entityManager.getReference(
                    AccountJpaEntity.class,
                    community.getAuthor().getId().value()
            );

            CommunityJpaEntity entity = CommunityJpaEntity.create(
                    accountRef,
                    community.getTitle().value(),
                    community.getContent().value(),
                    community.getCommunityCode().value(),
                    community.getTags()
            );
            return communityRepository.save(entity).getCommunityId();
        }
    }

    @Override
    public void delete(Long communityId) {
        int affectedRows = communityRepository.softDelete(communityId);
        if (affectedRows == 0) {
            throw new CommunityException(CommunityErrorCode.NOT_FOUND);
        }
    }

    @Override
    public void incrementView(Long communityId) {
        communityRepository.incrementViewCount(communityId);
    }

    @Override
    public CommunityDeleteProjection loadForDelete(Long communityId) {
        return communityRepository.findDeleteProjectionById(communityId)
                .orElse(null);
    }

    // =============================================================
    // Feed (List) Queries
    // =============================================================

    @Override
    public CommunityListPage loadCommunityList(ListCommunityQuery query) {
        boolean hasTagFilter = query.getTags() != null && !query.getTags().isEmpty();
        List<String> tags = hasTagFilter ? query.getTags() : Arrays.asList("DUMMY_TAG");
        
        Pageable pageable = query.getPageable();
        // Native Query Sort Mapping
        Pageable nativePageable = translateSortForNativeQuery(pageable);

        Page<Long> idPage = communityRepository.findCommunityIds(
            query.getCommunityCode(),
            query.getAuthorStatus(),
            query.getAuthorId(),
            query.getAuthorName(),
            tags,
            hasTagFilter,
            nativePageable
        );
        
        List<Long> communityIds = idPage.getContent();
        
        if (communityIds.isEmpty()) {
            return CommunityListPage.builder()
                .rows(Collections.emptyList())
                .totalElements(0L)
                .totalPages(0)
                .currentPage(query.getPageable().getPageNumber())
                .size(query.getPageable().getPageSize())
                .build();
        }

        List<CommunityListProjection> projections = communityRepository.findCommunityRowsByIds(communityIds);

        Map<Long, Integer> orderMap = new HashMap<>();
        for (int i = 0; i < communityIds.size(); i++) {
            orderMap.put(communityIds.get(i), i);
        }

        Map<Long, List<String>> tagsMap = fetchTags(communityIds);
        Map<Long, Long> commentCountMap = fetchCommentCounts(communityIds);
        Map<Long, List<CommunityRow.ReactionCount>> reactionsMap = fetchReactions(communityIds);

        List<CommunityRow> rows = projections.stream()
            .map(p -> mapToCommunityRow(p, tagsMap, commentCountMap, reactionsMap))
            .sorted(Comparator.comparingInt(row -> orderMap.getOrDefault(row.getCommunityId(), Integer.MAX_VALUE)))
            .collect(Collectors.toList());

        return CommunityListPage.builder()
            .rows(rows)
            .totalElements(idPage.getTotalElements())
            .totalPages(idPage.getTotalPages())
            .currentPage(idPage.getNumber())
            .size(idPage.getSize())
            .build();
    }

    // =============================================================
    // View (Detail) Queries
    // =============================================================

    @Override
    public Optional<CommunityDetail> loadCommunityDetail(Long communityId, Long requesterAccountId) {
        return communityRepository.findByIdWithAuthor(communityId)
            .map(entity -> {
                List<Long> ids = Collections.singletonList(communityId);
                Map<Long, List<String>> tags = fetchTags(ids);
                Map<Long, Long> comments = fetchCommentCounts(ids);
                Map<Long, List<CommunityRow.ReactionCount>> reactions = fetchReactions(ids);
                
                List<CommunityRow.ReactionCount> rowReactions = reactions.getOrDefault(communityId, Collections.emptyList());
                List<CommunityDetail.ReactionCount> detailReactions = rowReactions.stream()
                     .map(r -> CommunityDetail.ReactionCount.builder().type(r.getType()).count(r.getCount()).build())
                     .collect(Collectors.toList());

                // Fetch user reactions if authenticated
                List<CommunityDetail.ReactionCount> userReactions = Collections.emptyList();
                if (requesterAccountId != null) {
                    List<UserReactionProjection> userReactionProjections = reactionRepository.findUserReactions(requesterAccountId, ids);
                    
                    userReactions = userReactionProjections.stream()
                            .map(r -> CommunityDetail.ReactionCount.builder()
                                    .type(r.getReactionCode())
                                    .count(1L)
                                    .build())
                            .collect(Collectors.toList());
                }

                String companyName = null;
                if (entity.getAccount().getCompanyId() != null) {
                    companyName = companyRepository.findById(entity.getAccount().getCompanyId())
                            .map(com.b205.ozazak.infra.company.entity.CompanyJpaEntity::getName)
                            .orElse(null);
                }
                
                return CommunityDetail.builder()
                    .communityId(entity.getCommunityId())
                    .communityCode(entity.getCommunityCode())
                    .title(entity.getTitle())
                    .content(entity.getContent())
                    .author(CommunityDetail.AuthorInfo.builder()
                        .accountId(entity.getAccount().getAccountId())
                        .name(entity.getAccount().getName())
                        .img(entity.getAccount().getImg())
                        .companyName(companyName)
                        .build())
                    .view(entity.getView())
                    .commentCount(comments.getOrDefault(communityId, 0L))
                    .tags(tags.getOrDefault(communityId, Collections.emptyList()))
                    .reactions(detailReactions)
                    .userReactions(userReactions)
                    .createdAt(entity.getCreatedAt())
                    .build();
            });
    }

    // =============================================================
    // Category Stats
    // =============================================================

    @Override
    public Map<Integer, CategoryStat> loadStats(LocalDateTime start, LocalDateTime end) {
        List<TotalCountProjection> totalList = communityRepository.findTotalCounts();
        List<TodayCountProjection> todayList = communityRepository.findTodayCounts(start, end);
            
        Map<Integer, CategoryStat.CategoryStatBuilder> builderMap = new HashMap<>();
        
        for (TotalCountProjection p : totalList) {
            builderMap.computeIfAbsent(p.getCommunityCode(), k -> CategoryStat.builder().communityCode(k))
                .totalCount(p.getTotalCount());
        }
        
        for (TodayCountProjection p : todayList) {
            builderMap.computeIfAbsent(p.getCommunityCode(), k -> CategoryStat.builder().communityCode(k))
                .todayCount(p.getTodayCount());
        }
        
        return builderMap.values().stream()
            .map(b -> {
                CategoryStat stat = b.build();
                return CategoryStat.builder()
                    .communityCode(stat.getCommunityCode())
                    .totalCount(stat.getTotalCount() == null ? 0L : stat.getTotalCount())
                    .todayCount(stat.getTodayCount() == null ? 0L : stat.getTodayCount())
                    .build();
            })
            .collect(Collectors.toMap(CategoryStat::getCommunityCode, stat -> stat));
    }

    // =============================================================
    // Legacy / TIL List
    // =============================================================

    @Override
    public Page<Community> findSummaries(Pageable pageable) {
        Page<CommunitySummaryJpaResult> summaries = communityRepository.findSummaries(pageable);
        List<Long> ids = summaries.getContent().stream()
                .map(CommunitySummaryJpaResult::getCommunityId)
                .collect(Collectors.toList());
        Map<Long, List<String>> tagMap = fetchTags(ids);
        return summaries.map(result -> mapToDomain(result, tagMap.getOrDefault(result.getCommunityId(), Collections.emptyList())));
    }

    @Override
    public TilListPage loadTilList(ListTilQuery query) {
        boolean hasTagFilter = query.tags() != null && !query.tags().isEmpty();
        List<String> tags = hasTagFilter ? query.tags() : Arrays.asList("DUMMY_TAG");
        
        Pageable pageable = org.springframework.data.domain.PageRequest.of(query.page(), query.size());
        Page<Long> idPage = communityRepository.findTilIds(
            query.communityCode(),
            query.authorStatus(),
            query.authorId(),
            query.authorName(),
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
        
        List<TilBaseProjection> projections = communityRepository.findTilRowsByIds(communityIds);
        
        Map<Long, Integer> orderMap = new HashMap<>();
        for (int i = 0; i < communityIds.size(); i++) {
            orderMap.put(communityIds.get(i), i);
        }
        
        List<TilRow> rows = projections.stream()
            .map(this::projectionToTilRow)
            .sorted(Comparator.comparingInt(row -> orderMap.getOrDefault(row.getCommunityId(), Integer.MAX_VALUE)))
            .collect(Collectors.toList());
        
        Map<Long, List<String>> tagsMap = fetchTags(communityIds);
        Map<Long, Long> commentCountMap = fetchCommentCounts(communityIds);
        
        Map<Long, List<TilItemResult.ReactionInfo>> reactionsMap = 
            communityRepository.findReactionsForTilList(communityIds).stream()
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

        // Fetch user reactions if authenticated
        if (query.requesterAccountId() != null && !communityIds.isEmpty()) {
            System.out.println("DEBUG: Fetching user reactions for account=" + query.requesterAccountId() + ", communities=" + communityIds);
            
            List<UserReactionProjection> userReactions = reactionRepository.findUserReactions(query.requesterAccountId(), communityIds);
            System.out.println("DEBUG: Found reactions count=" + userReactions.size());
            userReactions.forEach(r -> System.out.println("DEBUG: reaction community=" + r.getCommunityId() + ", code=" + r.getReactionCode()));
            
            Map<Long, List<Integer>> userReactionMap = userReactions.stream()
                .collect(Collectors.groupingBy(
                    UserReactionProjection::getCommunityId,
                    Collectors.mapping(UserReactionProjection::getReactionCode, Collectors.toList())
                ));
            
            rows.forEach(row -> {
                List<Integer> codes = userReactionMap.getOrDefault(row.getCommunityId(), Collections.emptyList());
                List<TilItemResult.ReactionInfo> reactionInfos = codes.stream()
                        .map(code -> TilItemResult.ReactionInfo.builder()
                                .type(code)
                                .count(1L)
                                .build())
                        .collect(Collectors.toList());
                row.setUserReaction(reactionInfos);
            });
        } else {
            System.out.println("DEBUG: Skipping user reactions. Account=" + query.requesterAccountId() + ", CommunitiesEmpty=" + communityIds.isEmpty());
            rows.forEach(row -> row.setUserReaction(Collections.emptyList()));
        }
        
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

    // =============================================================
    // Internal Helpers
    // =============================================================

    private Map<Long, List<String>> fetchTags(List<Long> ids) {
        if (ids.isEmpty()) return Collections.emptyMap();
        List<CommunityJpaRepository.TagMapping> tagResults = communityRepository.findTagsForTilList(ids); 
        return tagResults.stream()
                .collect(Collectors.groupingBy(
                        CommunityJpaRepository.TagMapping::getCommunityId,
                        Collectors.mapping(CommunityJpaRepository.TagMapping::getTag, Collectors.toList())
                ));
    }

    private Map<Long, Long> fetchCommentCounts(List<Long> ids) {
        return communityRepository.findCommentCountsForTilList(ids).stream()
            .collect(Collectors.toMap(
                CommunityJpaRepository.CommentCountMapping::getCommunityId,
                CommunityJpaRepository.CommentCountMapping::getCount
            ));
    }
    
    private Map<Long, List<CommunityRow.ReactionCount>> fetchReactions(List<Long> ids) {
        return communityRepository.findReactionsForTilList(ids).stream()
            .collect(Collectors.groupingBy(
                CommunityJpaRepository.ReactionCountMapping::getCommunityId,
                Collectors.mapping(
                    r -> CommunityRow.ReactionCount.builder()
                        .type(r.getType())
                        .count(r.getCount())
                        .build(),
                    Collectors.toList()
                )
            ));
    }

    private CommunityRow mapToCommunityRow(CommunityListProjection p,
                                           Map<Long, List<String>> tagsMap,
                                           Map<Long, Long> commentCountMap,
                                           Map<Long, List<CommunityRow.ReactionCount>> reactionsMap) {
        Long id = p.getCommunityId();
        return CommunityRow.builder()
            .communityId(id)
            .communityCode(p.getCommunityCode())
            .title(p.getTitle())
            .content(p.getContent())
            .author(CommunityRow.AuthorInfo.builder()
                    .accountId(p.getAuthorId())
                    .name(p.getAuthorName())
                    .img(p.getAuthorImg())
                    .companyName(p.getCompanyName())
                    .build())
            .view(p.getView())
            .commentCount(commentCountMap.getOrDefault(id, 0L))
            .tags(tagsMap.getOrDefault(id, Collections.emptyList()))
            .reactions(reactionsMap.getOrDefault(id, Collections.emptyList()))
            .createdAt(p.getCreatedAt())
            .build();
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
                // Need to fetch other fields if needed, but for validation we just need ID/Author
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

    private Pageable translateSortForNativeQuery(Pageable pageable) {
        if (!pageable.getSort().isSorted()) {
            return pageable;
        }

        List<org.springframework.data.domain.Sort.Order> orders = new ArrayList<>();
        
        for (org.springframework.data.domain.Sort.Order order : pageable.getSort()) {
            String property = order.getProperty().trim(); // safe trim
            String newProperty = null;
            
            // Map camelCase DTO fields to snake_case column names.
            // DO NOT include table alias "c." here because Spring Data JPA's native query support
            // automatically prepends the primary alias "c" found in the "FROM community c" clause.
            // Providing "c.created_at" results in "c.c.created_at" (double alias error).
            switch (property) {
                case "createdAt":
                    newProperty = "created_at"; 
                    break;
                case "view":
                    newProperty = "view";
                    break;
                case "title":
                    newProperty = "title";
                    break;
                case "communityId":
                    newProperty = "community_id";
                    break;
                case "updatedAt":
                     newProperty = "updated_at";
                     break;
                case "isHot":
                     newProperty = "is_hot";
                     break;
                case "communityCode":
                     newProperty = "community_code";
                     break;
                default:
                    // Ignore unknown properties to prevent SQL injection or errors (e.g. " desc" from malformed URL)
                    continue;
            }
            
            if (newProperty != null) {
                // Use JpaSort.unsafe to allow aliased columns in native query
                 orders.add(org.springframework.data.jpa.domain.JpaSort.unsafe(order.getDirection(), newProperty).getOrderFor(newProperty));
            }
        }
        
        if (orders.isEmpty()) {
             // Fallback default sort if all were filtered out
             // Also remove "c." here
             return org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                org.springframework.data.jpa.domain.JpaSort.unsafe(org.springframework.data.domain.Sort.Direction.DESC, "created_at")
            );
        }

        return org.springframework.data.domain.PageRequest.of(
            pageable.getPageNumber(), 
            pageable.getPageSize(), 
            org.springframework.data.jpa.domain.JpaSort.by(orders)
        );
    }
}
