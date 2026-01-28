package com.b205.ozazak.infra.comment.adapter;

import com.b205.ozazak.application.comment.port.out.LoadCommentListPort;
import com.b205.ozazak.application.comment.port.out.dto.CommentRow;
import com.b205.ozazak.infra.comment.repository.CommentJpaRepository;
import com.b205.ozazak.infra.comment.repository.projection.CommentRowProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CommentPersistenceAdapter implements LoadCommentListPort {

    private final CommentJpaRepository commentJpaRepository;

    @Override
    public List<CommentRow> loadByCommunityId(Long communityId) {
        List<CommentRowProjection> projections = commentJpaRepository.findByCommunityId(communityId);
        return projections.stream()
                .map(this::toCommentRow)
                .collect(Collectors.toList());
    }

    private CommentRow toCommentRow(CommentRowProjection projection) {
        return CommentRow.builder()
                .commentId(projection.getCommentId())
                .authorId(projection.getAuthorId())
                .authorName(projection.getAuthorName())
                .authorImg(projection.getAuthorImg())
                .companyName(projection.getCompanyName())
                .content(projection.getContent())
                .createdAt(projection.getCreatedAt())
                .updatedAt(projection.getUpdatedAt())
                .build();
    }
}
