package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.ListCommunityCommand;
import com.b205.ozazak.application.community.port.in.ListCommunityUseCase;
import com.b205.ozazak.application.community.port.out.LoadCommunityListPort;
import com.b205.ozazak.application.community.port.out.dto.CommunityListPage;
import com.b205.ozazak.application.community.port.out.dto.CommunityRow;
import com.b205.ozazak.application.community.port.out.dto.ListCommunityQuery;
import com.b205.ozazak.application.community.result.ListCommunityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListCommunityService implements ListCommunityUseCase {

    private final LoadCommunityListPort loadCommunityListPort;

    @Override
    public ListCommunityResult list(ListCommunityCommand command) {
        // Map Command -> Query
        ListCommunityQuery query = ListCommunityQuery.builder()
                .communityCode(command.getCommunityCode())
                .authorId(command.getAuthorId())
                .tags(command.getTags())
                .pageable(command.getPageable())
                .build();

        // Load
        CommunityListPage page = loadCommunityListPort.loadCommunityList(query);

        // Map Page -> Result
        List<ListCommunityResult.CommunityItem> items = page.getRows().stream()
                .map(row -> ListCommunityResult.CommunityItem.builder()
                        .communityId(row.getCommunityId())
                        .communityCode(row.getCommunityCode())
                        .title(row.getTitle())
                        .content(row.getContent())
                        .authorId(row.getAuthor() == null ? null : row.getAuthor().getAccountId())
                        .authorName(row.getAuthor() == null ? null : row.getAuthor().getName())
                        .authorImg(row.getAuthor() == null ? null : row.getAuthor().getImg())
                        .companyName(row.getAuthor() == null ? null : row.getAuthor().getCompanyName())
                        .view(row.getView())
                        .commentCount(row.getCommentCount())
                        .tags(row.getTags())
                        .reactions(mapReactions(row.getReactions()))
                        .createdAt(row.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        ListCommunityResult.PageInfo pageInfo = ListCommunityResult.PageInfo.builder()
                .totalPage(page.getTotalPages())
                .currentPage(page.getCurrentPage())
                .totalElements(page.getTotalElements())
                .size(page.getSize())
                .build();

        return ListCommunityResult.builder()
                .items(items)
                .resultPage(pageInfo)
                .build();
    }

    private List<ListCommunityResult.ReactionInfo> mapReactions(List<CommunityRow.ReactionCount> reactions) {
        if (reactions == null) return List.of();
        return reactions.stream()
                .map(r -> ListCommunityResult.ReactionInfo.builder()
                        .type(r.getType())
                        .count(r.getCount())
                        .build())
                .collect(Collectors.toList());
    }
}
