package com.b205.ozazak.presentation.comment.update;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.comment.command.UpdateCommentCommand;
import com.b205.ozazak.application.comment.port.in.UpdateCommentUseCase;
import com.b205.ozazak.application.comment.result.UpdateCommentResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/community-comments")
@RequiredArgsConstructor
public class UpdateCommentController {

    private final UpdateCommentUseCase updateCommentUseCase;

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request,
            @AuthenticationPrincipal CustomPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("code", "UNAUTHORIZED", "message", "Authentication required"));
        }

        UpdateCommentCommand command = UpdateCommentCommand.builder()
                .commentId(commentId)
                .editorAccountId(principal.getAccountId())
                .content(request.getContent())
                .build();

        UpdateCommentResult result = updateCommentUseCase.update(command);

        return ResponseEntity.ok(Map.of("data", Map.of("commentId", result.getCommentId())));
    }
}
