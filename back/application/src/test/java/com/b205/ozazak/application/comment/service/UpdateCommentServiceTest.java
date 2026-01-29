package com.b205.ozazak.application.comment.service;

import com.b205.ozazak.application.comment.command.UpdateCommentCommand;
import com.b205.ozazak.application.comment.port.out.LoadCommentPort;
import com.b205.ozazak.application.comment.port.out.UpdateCommentPort;
import com.b205.ozazak.application.comment.port.out.dto.CommentStatus;
import com.b205.ozazak.application.comment.result.UpdateCommentResult;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class UpdateCommentServiceTest {

    @Mock
    private LoadCommentPort loadCommentPort;

    @Mock
    private UpdateCommentPort updateCommentPort;

    @InjectMocks
    private UpdateCommentService updateCommentService;

    @Test
    @DisplayName("Success: returns updated commentId")
    void update_success_returnsCommentId() {
        // Given
        Long commentId = 10L;
        Long editorId = 100L;
        String newContent = "Updated content";

        CommentStatus status = CommentStatus.builder()
                .commentId(commentId)
                .authorId(editorId)
                .deletedAt(null)
                .build();

        given(loadCommentPort.loadStatus(commentId)).willReturn(Optional.of(status));

        UpdateCommentCommand command = UpdateCommentCommand.builder()
                .commentId(commentId)
                .editorAccountId(editorId)
                .content(newContent)
                .build();

        // When
        UpdateCommentResult result = updateCommentService.update(command);

        // Then
        assertThat(result.getCommentId()).isEqualTo(commentId);
        verify(updateCommentPort).update(commentId, newContent);
    }

    @Test
    @DisplayName("Comment not found: throws 404")
    void update_notFound_throws404() {
        // Given
        Long commentId = 999L;
        given(loadCommentPort.loadStatus(commentId)).willReturn(Optional.empty());

        UpdateCommentCommand command = UpdateCommentCommand.builder()
                .commentId(commentId)
                .editorAccountId(100L)
                .content("Content")
                .build();

        // When & Then
        assertThatThrownBy(() -> updateCommentService.update(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);
    }

    @Test
    @DisplayName("Deleted comment: throws 404")
    void update_deleted_throws404() {
        // Given
        Long commentId = 10L;
        CommentStatus status = CommentStatus.builder()
                .commentId(commentId)
                .authorId(100L)
                .deletedAt(LocalDateTime.now())
                .build();

        given(loadCommentPort.loadStatus(commentId)).willReturn(Optional.of(status));

        UpdateCommentCommand command = UpdateCommentCommand.builder()
                .commentId(commentId)
                .editorAccountId(100L)
                .content("Content")
                .build();

        // When & Then
        assertThatThrownBy(() -> updateCommentService.update(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);
    }

    @Test
    @DisplayName("Author mismatch: throws 403")
    void update_authorMismatch_throws403() {
        // Given
        Long commentId = 10L;
        Long authorId = 100L;
        Long editorId = 200L; // Different user

        CommentStatus status = CommentStatus.builder()
                .commentId(commentId)
                .authorId(authorId)
                .deletedAt(null)
                .build();

        given(loadCommentPort.loadStatus(commentId)).willReturn(Optional.of(status));

        UpdateCommentCommand command = UpdateCommentCommand.builder()
                .commentId(commentId)
                .editorAccountId(editorId)
                .content("Content")
                .build();

        // When & Then
        assertThatThrownBy(() -> updateCommentService.update(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.FORBIDDEN);
    }
}
