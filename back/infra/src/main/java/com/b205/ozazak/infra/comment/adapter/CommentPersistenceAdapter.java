package com.b205.ozazak.infra.comment.adapter;

import com.b205.ozazak.application.comment.port.out.LoadCommentListPort;
import com.b205.ozazak.application.comment.port.out.SaveCommentPort;
import com.b205.ozazak.application.comment.port.out.dto.CommentRow;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.comment.entity.CommentJpaEntity;
import com.b205.ozazak.infra.comment.repository.CommentJpaRepository;
import com.b205.ozazak.infra.comment.repository.projection.CommentRowProjection;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CommentPersistenceAdapter implements LoadCommentListPort, SaveCommentPort {

    private final CommentJpaRepository commentJpaRepository;
    private final EntityManager entityManager;

    @Override
    public List<CommentRow> loadByCommunityId(Long communityId) {
        List<CommentRowProjection> projections = commentJpaRepository.findByCommunityId(communityId);
        return projections.stream()
                .map(this::toCommentRow)
                .collect(Collectors.toList());
    }

    @Override
    public Long save(Long communityId, Long authorAccountId, String content) {
        // Use getReference() for FK wiring - no immediate DB hit
        CommunityJpaEntity communityRef = entityManager.getReference(CommunityJpaEntity.class, communityId);
        AccountJpaEntity accountRef = entityManager.getReference(AccountJpaEntity.class, authorAccountId);

        CommentJpaEntity comment = CommentJpaEntity.create(communityRef, accountRef, content);
        CommentJpaEntity saved = commentJpaRepository.save(comment);
        return saved.getCommentId();
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

