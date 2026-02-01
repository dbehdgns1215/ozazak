package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.ListTilCommand;
import com.b205.ozazak.application.community.port.in.ListTilUseCase;
import com.b205.ozazak.application.community.port.out.dto.ListTilQuery;
import com.b205.ozazak.application.community.port.out.LoadTilListPort;
import com.b205.ozazak.application.community.port.out.dto.TilListPage;
import com.b205.ozazak.application.community.port.out.dto.TilRow;
import com.b205.ozazak.application.community.result.ListTilResult;
import com.b205.ozazak.application.community.result.PageInfoResult;
import com.b205.ozazak.application.community.result.TilItemResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for listing TIL posts
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListTilService implements ListTilUseCase {

    private final LoadTilListPort loadTilListPort;

    @Override
    public ListTilResult list(ListTilCommand command) {
        // Build query with TIL filter (communityCode = 1) enforced at application layer
        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1) // TIL code
                .authorStatus(command.authorStatus())
                .authorId(command.authorId())
                .authorName(command.authorName())
                .tags(command.tags())
                .page(command.page())
                .size(command.size())
                .build();

        // Load from infrastructure
        TilListPage page = loadTilListPort.loadTilList(query);

        // Map to application result
        List<TilItemResult> items = page.items().stream()
                .map(this::rowToResult)
                .collect(Collectors.toList());

        PageInfoResult pageInfo = PageInfoResult.builder()
                .currentPage(page.currentPage())
                .pageSize(page.pageSize())
                .totalElements(page.totalElements())
                .totalPages(page.totalPages())
                .hasNext(page.currentPage() < page.totalPages() - 1)
                .hasPrevious(page.currentPage() > 0)
                .build();

        return ListTilResult.builder()
                .items(items)
                .pageInfo(pageInfo)
                .build();
    }

    private TilItemResult rowToResult(TilRow row) {
        return TilItemResult.builder()
                .tilId(row.getCommunityId())
                .title(row.getTitle())
                .content(row.getContent())
                .author(TilItemResult.AuthorInfo.builder()
                        .accountId(row.getAuthorId())
                        .name(row.getAuthorName())
                        .img(row.getAuthorImg())
                        .companyName(row.getCompanyName())
                        .build())
                .tags(row.getTags())
                .view(row.getView())
                .commentCount(row.getCommentCount())
                .reactions(row.getReactions())
                .createdAt(row.getCreatedAt())
                .build();
    }
}
