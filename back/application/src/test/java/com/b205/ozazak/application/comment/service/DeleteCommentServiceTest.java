package com.b205.ozazak.application.comment.service;

import com.b205.ozazak.application.comment.command.DeleteCommentCommand;
import com.b205.ozazak.application.comment.port.out.DeleteCommentPort;
import com.b205.ozazak.application.comment.port.out.LoadCommentPort;
import com.b205.ozazak.application.comment.port.out.dto.CommentStatus;
import com.b205.ozazak.application.comment.result.DeleteCommentResult;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class DeleteCommentServiceTest {

    @Mock
    private LoadCommentPort loadCommentPort;

    @Mock
    private DeleteCommentPort deleteCommentPort;

    @InjectMocks
    private DeleteCommentService deleteCommentService;

    @Test
    @DisplayName("Success: soft delete comment and return deletedAt")
    void delete_success() {
        // Given
        Long commentId = 10L;
        Long deleterId = 100L;
        CommentStatus status = CommentStatus.builder()
                .commentId(commentId)
                .authorId(deleterId)
                .deletedAt(null)
                .build();

        given(loadCommentPort.loadStatus(commentId)).willReturn(Optional.of(status));

        DeleteCommentCommand command = DeleteCommentCommand.builder()
                .commentId(commentId)
                .deleterAccountId(deleterId)
                .build();

        // When
        DeleteCommentResult result = deleteCommentService.delete(command);

        // Then
        assertThat(result.getCommentId()).isEqualTo(commentId);
        assertThat(result.getDeletedAt()).isNotNull();
        verify(deleteCommentPort).softDelete(eq(commentId), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("Not Found: throw 404 when comment does not exist")
    void delete_notFound_throws404() {
        // Given
        Long commentId = 10L;
        given(loadCommentPort.loadStatus(commentId)).willReturn(Optional.empty());

        DeleteCommentCommand command = DeleteCommentCommand.builder()
                .commentId(commentId)
                .deleterAccountId(100L)
                .build();

        // When & Then
        assertThatThrownBy(() -> deleteCommentService.delete(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);
    }

    @Test
    @DisplayName("Already Deleted: throw 404")
    void delete_alreadyDeleted_throws404() {
        // Given
        Long commentId = 10L;
        CommentStatus status = CommentStatus.builder()
                .commentId(commentId)
                .authorId(100L)
                .deletedAt(LocalDateTime.now())
                .build();

        given(loadCommentPort.loadStatus(commentId)).willReturn(Optional.of(status));

        DeleteCommentCommand command = DeleteCommentCommand.builder()
                .commentId(commentId)
                .deleterAccountId(100L)
                .build();

        // When & Then
        assertThatThrownBy(() -> deleteCommentService.delete(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);
    }

    @Test
    @DisplayName("Forbidden: throw 403 when user is not author")
    void delete_forbidden_throws403() {
        // Given
        Long commentId = 10L;
        Long authorId = 100L;
        Long deleterId = 200L;

        CommentStatus status = CommentStatus.builder()
                .commentId(commentId)
                .authorId(authorId)
                .deletedAt(null)
                .build();

        given(loadCommentPort.loadStatus(commentId)).willReturn(Optional.of(status));

        DeleteCommentCommand command = DeleteCommentCommand.builder()
                .commentId(commentId)
                .deleterAccountId(deleterId)
                .build();

        // When & Then
        assertThatThrownBy(() -> deleteCommentService.delete(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.FORBIDDEN);
    }
}
