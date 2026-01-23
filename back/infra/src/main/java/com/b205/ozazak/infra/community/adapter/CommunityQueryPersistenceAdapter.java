package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.application.community.dto.AuthorSummaryDto;
import com.b205.ozazak.application.community.dto.CommunitySummaryDto;
import com.b205.ozazak.application.community.port.out.LoadCommunityListPort;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import com.b205.ozazak.infra.community.repository.projection.CommunitySummaryProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommunityQueryPersistenceAdapter implements LoadCommunityListPort {

    private final CommunityJpaRepository communityJpaRepository;

    @Override
    public Page<CommunitySummaryDto> loadCommunitySummaries(Pageable pageable) {
        Pageable effectivePageable = pageable;
        
        // Defensive: Ensure deterministic ordering if no sort is provided
        if (pageable.getSort().isUnsorted()) {
            effectivePageable = org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                org.springframework.data.domain.Sort.by(
                    org.springframework.data.domain.Sort.Order.desc("createdAt"),
                    org.springframework.data.domain.Sort.Order.desc("communityId")
                )
            );
        }

        Page<CommunitySummaryProjection> projections = communityJpaRepository.findProjectedSummaries(effectivePageable);
        
        return projections.map(this::mapToDto);
    }

    private CommunitySummaryDto mapToDto(CommunitySummaryProjection projection) {
        return CommunitySummaryDto.builder()
                .communityId(projection.getCommunityId())
                .title(projection.getTitle())
                .commentCount(projection.getCommentCount())
                .author(AuthorSummaryDto.builder()
                        .accountId(projection.getAuthorId())
                        .name(projection.getAuthorName())
                        .img(projection.getAuthorImg())
                        .build())
                .build();
    }
}
