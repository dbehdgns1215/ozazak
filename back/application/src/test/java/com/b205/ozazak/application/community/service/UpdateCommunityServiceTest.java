package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.UpdateCommunityCommand;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.LoadCommunityPort;
import com.b205.ozazak.application.community.port.out.SaveCommunityPort;
import com.b205.ozazak.application.community.result.UpdateCommunityResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.community.vo.CommunityCode;
import com.b205.ozazak.domain.community.vo.CommunityContent;
import com.b205.ozazak.domain.community.vo.CommunityId;
import com.b205.ozazak.domain.community.vo.CommunityTitle;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UpdateCommunityServiceTest {

    @InjectMocks
    private UpdateCommunityService updateCommunityService;

    @Mock
    private LoadCommunityPort loadCommunityPort;

    @Mock
    private SaveCommunityPort saveCommunityPort;

    @Test
    @DisplayName("Update succeeds when author matches and valid input")
    void update_WithValidOwner_Success() {
        // Given
        Long accountId = 1L;
        Long communityId = 10L;
        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .author(Account.builder().id(new AccountId(accountId)).build())
                .communityCode(new CommunityCode(1)) // TIL
                .title(new CommunityTitle("Old Title"))
                .content(new CommunityContent("Old Content"))
                .build();
        
        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));

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
        verify(saveCommunityPort).save(any(Community.class));
    }

    @Test
    @DisplayName("Update fails with NOT_FOUND when community does not exist")
    void update_NonExisting_ThrowsNotFound() {
        // Given
        Long communityId = 999L;
        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.empty());

        UpdateCommunityCommand command = UpdateCommunityCommand.builder()
                .accountId(1L)
                .communityId(communityId)
                .title("T")
                .content("C")
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
        
        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .author(Account.builder().id(new AccountId(authorId)).build())
                .build();

        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));

        UpdateCommunityCommand command = UpdateCommunityCommand.builder()
                .accountId(otherId) // Requesting user is NOT author
                .communityId(communityId)
                .title("T")
                .content("C")
                .build();

        // When & Then
        assertThatThrownBy(() -> updateCommunityService.update(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.FORBIDDEN);
    }

    @Test
    @DisplayName("Update fails when invalid tags for non-TIL")
    void update_InvalidTags_ThrowsException() {
        // Given
        Long accountId = 1L;
        Long communityId = 10L;
        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .author(Account.builder().id(new AccountId(accountId)).build())
                .communityCode(new CommunityCode(2)) // Non-TIL
                .build();
        
        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));

        UpdateCommunityCommand command = UpdateCommunityCommand.builder()
                .accountId(accountId)
                .communityId(communityId)
                .communityCode(2) 
                .tags(List.of("tag")) // Tags present
                .title("Title")
                .content("Content")
                .build();

        // When & Then
        // Verify that Domain Logic (Community.update) throws Exception
        assertThatThrownBy(() -> updateCommunityService.update(command))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
