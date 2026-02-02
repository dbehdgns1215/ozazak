package com.b205.ozazak.application.comment.service;

import com.b205.ozazak.application.comment.command.CreateCommentCommand;
import com.b205.ozazak.application.comment.port.in.CreateCommentUseCase;
import com.b205.ozazak.application.comment.port.out.SaveCommentPort;
import com.b205.ozazak.application.comment.result.CreateCommentResult;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.LoadCommunityPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateCommentService implements CreateCommentUseCase {

    private final LoadCommunityPort loadCommunityPort;
    private final SaveCommentPort saveCommentPort;

    @Override
    public CreateCommentResult create(CreateCommentCommand command) {
        // 1. Verify community exists (404 if not found or deleted)
        loadCommunityPort.loadCommunity(command.getCommunityId())
                .orElseThrow(() -> new CommunityException(CommunityErrorCode.NOT_FOUND));

        // 2. Future: apply business rules (rate limit, blocked user, etc.)

        // 3. Persist comment
        Long commentId = saveCommentPort.save(
                command.getCommunityId(),
                command.getAuthorAccountId(),
                command.getContent()
        );

        return new CreateCommentResult(commentId);
    }
}
