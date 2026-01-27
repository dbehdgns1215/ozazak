package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.UpdateCommunityCommand;
import com.b205.ozazak.application.community.command.UpdateCommunityParams;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.dto.CommunityAuthorProjection;
import com.b205.ozazak.application.community.port.out.LoadCommunityForUpdatePort;
import com.b205.ozazak.application.community.port.out.UpdateCommunityPort;
import com.b205.ozazak.application.community.result.UpdateCommunityResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UpdateCommunityServiceTest {

    @InjectMocks
    private UpdateCommunityService updateCommunityService;

    @Mock
    private LoadCommunityForUpdatePort loadCommunityPort;

    @Mock
    private UpdateCommunityPort updateCommunityPort;

    @Test
    @DisplayName("Update succeeds when author matches and valid input")
    void update_WithValidOwner_Success() {
        // Given
        Long accountId = 1L;
        Long communityId = 10L;
        CommunityAuthorProjection projection = new CommunityAuthorProjection(accountId);
        given(loadCommunityPort.loadForUpdate(communityId)).willReturn(projection);

        UpdateCommunityCommand command = UpdateCommunityCommand.builder()
                .accountId(accountId)
                .communityId(communityId)
                .communityCode(1) // TIL
                .title("New Title")
                .content("New Content")
                .tags(List.of("tag1"))
                .build();

        // When
        UpdateCommunityResult result = updateCommunityService.update(command);

        // Then
        assertThat(result.getCommunityId()).isEqualTo(communityId);
        verify(updateCommunityPort).update(eq(communityId), any(UpdateCommunityParams.class));
    }

    @Test
    @DisplayName("Update fails with NOT_FOUND when community does not exist")
    void update_NonExisting_ThrowsNotFound() {
        // Given
        Long communityId = 999L;
        given(loadCommunityPort.loadForUpdate(communityId)).willReturn(null);

        UpdateCommunityCommand command = UpdateCommunityCommand.builder()
                .accountId(1L)
                .communityId(communityId)
                .communityCode(1)
                .tags(Collections.emptyList())
                .build();

        // When & Then
        assertThatThrownBy(() -> updateCommunityService.update(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);
    }

    @Test
    @DisplayName("Update fails with FORBIDDEN when user is not author")
    void update_Unauthorized_ThrowsForbidden() {
        // Given
        Long authorId = 1L;
        Long otherId = 2L;
        Long communityId = 10L;
        CommunityAuthorProjection projection = new CommunityAuthorProjection(authorId);
        given(loadCommunityPort.loadForUpdate(communityId)).willReturn(projection);

        UpdateCommunityCommand command = UpdateCommunityCommand.builder()
                .accountId(otherId) // Requesting user is NOT author
                .communityId(communityId)
                .communityCode(1)
                .tags(Collections.emptyList())
                .build();

        // When & Then
        assertThatThrownBy(() -> updateCommunityService.update(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.FORBIDDEN);
    }

    @Test
    @DisplayName("Update fails with BAD_REQUEST when invalid tags for non-TIL")
    void update_InvalidTags_ThrowsBadRequest() {
        // Given
        UpdateCommunityCommand command = UpdateCommunityCommand.builder()
                .accountId(1L)
                .communityId(10L)
                .communityCode(2) // Not TIL
                .tags(List.of("tag")) // Tags present
                .build();

        // When & Then
        assertThatThrownBy(() -> updateCommunityService.update(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.BAD_REQUEST);
    }
}
