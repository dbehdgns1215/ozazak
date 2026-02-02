package com.b205.ozazak.presentation.comment.delete;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.comment.command.DeleteCommentCommand;
import com.b205.ozazak.application.comment.port.in.DeleteCommentUseCase;
import com.b205.ozazak.application.comment.result.DeleteCommentResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/community-comments")
@RequiredArgsConstructor
public class DeleteCommentController {

    private final DeleteCommentUseCase deleteCommentUseCase;

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("code", "UNAUTHORIZED", "message", "Authentication required"));
        }

        DeleteCommentCommand command = DeleteCommentCommand.builder()
                .commentId(commentId)
                .deleterAccountId(principal.getAccountId())
                .build();

        DeleteCommentResult result = deleteCommentUseCase.delete(command);

        return ResponseEntity.ok(Map.of("data", Map.of(
                "commentId", result.getCommentId(),
                "deletedAt", result.getDeletedAt().format(DateTimeFormatter.ISO_DATE_TIME)
        )));
    }
}
