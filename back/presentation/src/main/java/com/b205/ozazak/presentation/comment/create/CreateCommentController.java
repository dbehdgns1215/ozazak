package com.b205.ozazak.presentation.comment.create;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.comment.command.CreateCommentCommand;
import com.b205.ozazak.application.comment.port.in.CreateCommentUseCase;
import com.b205.ozazak.application.comment.result.CreateCommentResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/community-posts")
@RequiredArgsConstructor
public class CreateCommentController {

    private final CreateCommentUseCase createCommentUseCase;

    @PostMapping("/{communityId}/comments")
    public ResponseEntity<?> createComment(
            @PathVariable Long communityId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal CustomPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("code", "UNAUTHORIZED", "message", "Authentication required"));
        }

        CreateCommentCommand command = CreateCommentCommand.builder()
                .communityId(communityId)
                .authorAccountId(principal.getAccountId())
                .content(request.getContent())
                .build();

        CreateCommentResult result = createCommentUseCase.create(command);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("data", Map.of("commentId", result.getCommentId())));
    }
}
