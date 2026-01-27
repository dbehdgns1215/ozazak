package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.DeleteCommunityCommand;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.CommunityDeleteProjection;
import com.b205.ozazak.application.community.port.out.DeleteCommunityPort;
import com.b205.ozazak.application.community.port.out.LoadCommunityForDeletePort;
import com.b205.ozazak.application.community.result.DeleteCommunityResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class DeleteCommunityServiceTest {

    @Mock
    private LoadCommunityForDeletePort loadCommunityForDeletePort;

    @Mock
    private DeleteCommunityPort deleteCommunityPort;

    @InjectMocks
    private DeleteCommunityService deleteCommunityService;

    @Test
    @DisplayName("Author can delete own post")
    void authorCanDeleteOwnPost() {
        // Given
        Long communityId = 1L;
        Long authorId = 100L;
        DeleteCommunityCommand command = new DeleteCommunityCommand(communityId, authorId, false);

        CommunityDeleteProjection projection = new CommunityDeleteProjection() {
            @Override
            public Long getAuthorId() {
                return authorId;
            }

            @Override
            public LocalDateTime getDeletedAt() {
                return null;
            }
        };

        given(loadCommunityForDeletePort.loadForDelete(communityId)).willReturn(projection);

        // When
        DeleteCommunityResult result = deleteCommunityService.delete(command);

        // Then
        assertThat(result.getCommunityId()).isEqualTo(communityId);
        then(deleteCommunityPort).should().delete(communityId);
    }

    @Test
    @DisplayName("Admin can delete any post")
    void adminCanDeleteAnyPost() {
        // Given
        Long communityId = 1L;
        Long authorId = 100L;
        Long adminId = 999L;
        DeleteCommunityCommand command = new DeleteCommunityCommand(communityId, adminId, true);

        CommunityDeleteProjection projection = new CommunityDeleteProjection() {
            @Override
            public Long getAuthorId() {
                return authorId;
            }

            @Override
            public LocalDateTime getDeletedAt() {
                return null;
            }
        };

        given(loadCommunityForDeletePort.loadForDelete(communityId)).willReturn(projection);

        // When
        DeleteCommunityResult result = deleteCommunityService.delete(command);

        // Then
        assertThat(result.getCommunityId()).isEqualTo(communityId);
        then(deleteCommunityPort).should().delete(communityId);
    }

    @Test
    @DisplayName("Non-author/non-admin throws FORBIDDEN")
    void nonAuthorNonAdminThrowsForbidden() {
        // Given
        Long communityId = 1L;
        Long authorId = 100L;
        Long otherUserId = 200L;
        DeleteCommunityCommand command = new DeleteCommunityCommand(communityId, otherUserId, false);

        CommunityDeleteProjection projection = new CommunityDeleteProjection() {
            @Override
            public Long getAuthorId() {
                return authorId;
            }

            @Override
            public LocalDateTime getDeletedAt() {
                return null;
            }
        };

        given(loadCommunityForDeletePort.loadForDelete(communityId)).willReturn(projection);

        // When & Then
        assertThatThrownBy(() -> deleteCommunityService.delete(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.FORBIDDEN);

        then(deleteCommunityPort).should(never()).delete(communityId);
    }

    @Test
    @DisplayName("Already deleted post throws NOT_FOUND")
    void alreadyDeletedThrowsNotFound() {
        // Given
        Long communityId = 1L;
        Long authorId = 100L;
        DeleteCommunityCommand command = new DeleteCommunityCommand(communityId, authorId, false);

        CommunityDeleteProjection projection = new CommunityDeleteProjection() {
            @Override
            public Long getAuthorId() {
                return authorId;
            }

            @Override
            public LocalDateTime getDeletedAt() {
                return LocalDateTime.now();
            }
        };

        given(loadCommunityForDeletePort.loadForDelete(communityId)).willReturn(projection);

        // When & Then
        assertThatThrownBy(() -> deleteCommunityService.delete(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);

        then(deleteCommunityPort).should(never()).delete(communityId);
    }

    @Test
    @DisplayName("Non-existent post throws NOT_FOUND")
    void nonExistentPostThrowsNotFound() {
        // Given
        Long communityId = 999L;
        Long userId = 100L;
        DeleteCommunityCommand command = new DeleteCommunityCommand(communityId, userId, false);

        given(loadCommunityForDeletePort.loadForDelete(communityId)).willReturn(null);

        // When & Then
        assertThatThrownBy(() -> deleteCommunityService.delete(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);

        then(deleteCommunityPort).should(never()).delete(communityId);
    }

    @Test
    @DisplayName("Double delete throws NOT_FOUND")
    void doubleDeleteThrowsNotFound() {
        // Given
        Long communityId = 1L;
        Long authorId = 100L;
        DeleteCommunityCommand command = new DeleteCommunityCommand(communityId, authorId, false);

        // First call: projection with deletedAt set
        CommunityDeleteProjection deletedProjection = new CommunityDeleteProjection() {
            @Override
            public Long getAuthorId() {
                return authorId;
            }

            @Override
            public LocalDateTime getDeletedAt() {
                return LocalDateTime.now().minusMinutes(5);
            }
        };

        given(loadCommunityForDeletePort.loadForDelete(communityId)).willReturn(deletedProjection);

        // When & Then
        assertThatThrownBy(() -> deleteCommunityService.delete(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);

        then(deleteCommunityPort).should(never()).delete(communityId);
    }
}
