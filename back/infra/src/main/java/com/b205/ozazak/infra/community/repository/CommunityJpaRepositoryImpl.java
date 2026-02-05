package com.b205.ozazak.infra.community.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CommunityJpaRepositoryImpl implements CommunityJpaRepositoryCustom {

    private final EntityManager entityManager;

    private static final Map<String, String> SORT_MAPPING = new HashMap<>();

    static {
        SORT_MAPPING.put("createdAt", "c.created_at");
        SORT_MAPPING.put("view", "c.view");
        SORT_MAPPING.put("title", "c.title");
        SORT_MAPPING.put("communityId", "c.community_id");
        SORT_MAPPING.put("updatedAt", "c.updated_at");
        SORT_MAPPING.put("isHot", "c.is_hot");
        SORT_MAPPING.put("communityCode", "c.community_code");
    }

    @Override
    public Page<Long> findTilIdsCustom(
            Integer communityCode,
            String authorStatus,
            Long authorId,
            String authorName,
            String searchPattern,
            List<String> tags,
            boolean hasTagFilter,
            Pageable pageable
    ) {
        Map<String, Object> params = new HashMap<>();
        
        // Base structure
        StringBuilder sb = new StringBuilder();
        sb.append(" FROM community c");
        sb.append(" JOIN account a ON c.account_id = a.account_id");
        
        // Conditional JOIN for tags
        if (hasTagFilter) {
            sb.append(" LEFT JOIN community_tag ct ON c.community_id = ct.community_id");
        }

        // WHERE clause construction
        List<String> whereClauses = new ArrayList<>();
        whereClauses.add("c.deleted_at IS NULL");
        whereClauses.add("a.deleted_at IS NULL");

        if (communityCode != null) {
            whereClauses.add("c.community_code = :communityCode");
            params.put("communityCode", communityCode);
        }

        if (authorStatus != null) {
            whereClauses.add("a.author_status = :authorStatus");
            params.put("authorStatus", authorStatus);
        }

        if (authorId != null) {
            whereClauses.add("a.account_id = :authorId");
            params.put("authorId", authorId);
        }

        if (authorName != null) {
            whereClauses.add("a.name LIKE :authorName");
            params.put("authorName", "%" + authorName + "%"); 
        }

        if (searchPattern != null) {
            // "(:searchPattern IS NULL OR (c.title ILIKE :searchPattern ESCAPE '\\' OR c.content ILIKE :searchPattern ESCAPE '\\'))"
            // For manual construction, strict AND:
            whereClauses.add("(c.title ILIKE :searchPattern ESCAPE '\\' OR c.content ILIKE :searchPattern ESCAPE '\\')");
            params.put("searchPattern", searchPattern);
        }

        if (hasTagFilter && tags != null && !tags.isEmpty()) {
            whereClauses.add("ct.name IN :tags");
            params.put("tags", tags);
        }
        
        if (!whereClauses.isEmpty()) {
            sb.append(" WHERE ").append(String.join(" AND ", whereClauses));
        }

        String fromAndWhere = sb.toString();

        // 1. Count Query
        String countSql = "SELECT COUNT(DISTINCT c.community_id)" + fromAndWhere;
        Query countQuery = entityManager.createNativeQuery(countSql);
        params.forEach(countQuery::setParameter);
        
        Number totalObj = (Number) countQuery.getSingleResult();
        long total = totalObj != null ? totalObj.longValue() : 0L;

        if (total == 0) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        // 2. Data Query
        // Manual ORDER BY construction
        String orderByClause = buildOrderByClause(pageable.getSort());
        
        String fetchSql = "SELECT c.community_id" + fromAndWhere + " GROUP BY c.community_id " + orderByClause;
        
        Query dataQuery = entityManager.createNativeQuery(fetchSql);
        params.forEach(dataQuery::setParameter);
        
        // Pagination
        if (pageable.isPaged()) {
            dataQuery.setFirstResult((int) pageable.getOffset());
            dataQuery.setMaxResults(pageable.getPageSize());
        }

        List<Number> resultNumbers = dataQuery.getResultList();
        List<Long> ids = resultNumbers.stream()
                .map(Number::longValue)
                .collect(Collectors.toList());

        return new PageImpl<>(ids, pageable, total);
    }
    
    private String buildOrderByClause(Sort sort) {
        if (sort == null || !sort.isSorted()) {
            return "ORDER BY c.created_at DESC";
        }

        List<String> orders = new ArrayList<>();
        
        for (Sort.Order order : sort) {
            String property = order.getProperty();
            String column = SORT_MAPPING.get(property);
            
            if (column != null) {
                String direction = order.getDirection().isAscending() ? "ASC" : "DESC";
                orders.add(column + " " + direction);
            }
        }
        
        if (orders.isEmpty()) {
            return "ORDER BY c.created_at DESC";
        }
        
        return "ORDER BY " + String.join(", ", orders);
    }
}
