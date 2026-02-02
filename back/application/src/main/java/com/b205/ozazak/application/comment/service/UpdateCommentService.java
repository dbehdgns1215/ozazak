package com.b205.ozazak.application.comment.service;

import com.b205.ozazak.application.comment.command.UpdateCommentCommand;
import com.b205.ozazak.application.comment.port.in.UpdateCommentUseCase;
import com.b205.ozazak.application.comment.port.out.LoadCommentPort;
import com.b205.ozazak.application.comment.port.out.UpdateCommentPort;
import com.b205.ozazak.application.comment.port.out.dto.CommentStatus;
import com.b205.ozazak.application.comment.result.UpdateCommentResult;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateCommentService implements UpdateCommentUseCase {

    private final LoadCommentPort loadCommentPort;
    private final UpdateCommentPort updateCommentPort;

    @Override
    public UpdateCommentResult update(UpdateCommentCommand command) {
        // 1. Load comment status
        CommentStatus status = loadCommentPort.loadStatus(command.getCommentId())
                .orElseThrow(() -> new CommunityException(CommunityErrorCode.NOT_FOUND));

        // 2. Check deleted
        if (status.isDeleted()) {
            throw new CommunityException(CommunityErrorCode.NOT_FOUND);
        }

        // 3. Verify author (Editor must match Author)
        if (!status.getAuthorId().equals(command.getEditorAccountId())) {
            throw new CommunityException(CommunityErrorCode.FORBIDDEN);
        }

        // 4. Update content via Port
        updateCommentPort.update(command.getCommentId(), command.getContent());

        return new UpdateCommentResult(command.getCommentId());
    }
}
