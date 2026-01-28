package com.b205.ozazak.application.comment.service;

import com.b205.ozazak.application.comment.command.DeleteCommentCommand;
import com.b205.ozazak.application.comment.port.in.DeleteCommentUseCase;
import com.b205.ozazak.application.comment.port.out.DeleteCommentPort;
import com.b205.ozazak.application.comment.port.out.LoadCommentPort;
import com.b205.ozazak.application.comment.port.out.dto.CommentStatus;
import com.b205.ozazak.application.comment.result.DeleteCommentResult;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteCommentService implements DeleteCommentUseCase {

    private final LoadCommentPort loadCommentPort;
    private final DeleteCommentPort deleteCommentPort;

    @Override
    public DeleteCommentResult delete(DeleteCommentCommand command) {
        // 1. Load status (includes deleted rows)
        CommentStatus status = loadCommentPort.loadStatus(command.getCommentId())
                .orElseThrow(() -> new CommunityException(CommunityErrorCode.NOT_FOUND));

        // 2. Check already deleted (return 404 to hide details)
        if (status.isDeleted()) {
            throw new CommunityException(CommunityErrorCode.NOT_FOUND);
        }

        // 3. Verify author (Editor must match Author)
        if (!status.getAuthorId().equals(command.getDeleterAccountId())) {
            throw new CommunityException(CommunityErrorCode.FORBIDDEN);
        }

        // 4. Soft delete with generated timestamp
        LocalDateTime deletedAt = LocalDateTime.now();
        deleteCommentPort.softDelete(command.getCommentId(), deletedAt);

        return new DeleteCommentResult(command.getCommentId(), deletedAt);
    }
}
