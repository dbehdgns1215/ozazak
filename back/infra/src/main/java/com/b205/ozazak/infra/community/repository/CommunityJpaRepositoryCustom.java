package com.b205.ozazak.infra.community.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CommunityJpaRepositoryCustom {
    Page<Long> findTilIdsCustom(
        Integer communityCode,
        String authorStatus,
        Long authorId,
        String authorName,
        String searchPattern,
        List<String> tags,
        boolean hasTagFilter,
        Pageable pageable
    );
}
