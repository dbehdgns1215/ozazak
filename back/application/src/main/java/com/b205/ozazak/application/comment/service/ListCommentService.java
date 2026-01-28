package com.b205.ozazak.application.comment.service;

import com.b205.ozazak.application.comment.port.in.ListCommentUseCase;
import com.b205.ozazak.application.comment.port.out.LoadCommentListPort;
import com.b205.ozazak.application.comment.port.out.dto.CommentRow;
import com.b205.ozazak.application.comment.query.ListCommentQuery;
import com.b205.ozazak.application.comment.result.ListCommentResult;
import com.b205.ozazak.application.comment.result.ListCommentResult.AuthorInfo;
import com.b205.ozazak.application.comment.result.ListCommentResult.CommentItemResult;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.LoadCommunityPort;
import com.b205.ozazak.domain.community.entity.Community;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListCommentService implements ListCommentUseCase {

    private final LoadCommunityPort loadCommunityPort;
    private final LoadCommentListPort loadCommentListPort;

    @Override
    public ListCommentResult list(ListCommentQuery query) {
        // 1. Verify community exists and is not deleted
        Community community = loadCommunityPort.loadCommunity(query.getCommunityId())
                .orElseThrow(() -> new CommunityException(CommunityErrorCode.NOT_FOUND));
        
        // 2. Load comments
        List<CommentRow> rows = loadCommentListPort.loadByCommunityId(query.getCommunityId());

        // 3. Map to result with isMine calculation
        List<CommentItemResult> items = rows.stream()
                .map(row -> mapToResult(row, query.getViewerAccountId()))
                .collect(Collectors.toList());

        return ListCommentResult.builder()
                .items(items)
                .pageInfo(null)  // Reserved for future pagination
                .build();
    }

    private CommentItemResult mapToResult(CommentRow row, Long viewerAccountId) {
        boolean isMine = viewerAccountId != null && row.getAuthorId().equals(viewerAccountId);
        
        return CommentItemResult.builder()
                .commentId(row.getCommentId())
                .author(AuthorInfo.builder()
                        .accountId(row.getAuthorId())
                        .name(row.getAuthorName())
                        .img(row.getAuthorImg())
                        .companyName(row.getCompanyName())
                        .build())
                .content(row.getContent())
                .createdAt(row.getCreatedAt())
                .updatedAt(row.getUpdatedAt())
                .isMine(isMine)
                .build();
    }
}
