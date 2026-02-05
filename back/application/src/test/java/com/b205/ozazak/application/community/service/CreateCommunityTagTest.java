package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.CreateCommunityCommand;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.SaveCommunityPort;
import com.b205.ozazak.application.community.result.CreateCommunityResult;
import com.b205.ozazak.domain.community.entity.Community;
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
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CreateCommunityTagTest {

    @Mock
    private SaveCommunityPort saveCommunityPort;

    @InjectMocks
    private CreateCommunityService createCommunityService;

    @Test
    @DisplayName("TIL(1) allows tags -> Success")
    void createTilWithTags() {
        // Given
        CreateCommunityCommand command = new CreateCommunityCommand(
                1L, 1, "TIL Title", "Content", List.of("Spring", "Java")
        );
        given(saveCommunityPort.save(any(Community.class))).willReturn(10L);

        // When
        CreateCommunityResult result = createCommunityService.create(command);

        // Then
        assertThat(result.communityId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("QNA(7) does NOT allow tags -> Fail")
    void createQnaWithTags_Fails() {
        // Given
        CreateCommunityCommand command = new CreateCommunityCommand(
                1L, 7, "QNA Title", "How to process tags?", List.of("Help", "Question")
        );

        // When & Then
        assertThatThrownBy(() -> createCommunityService.create(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.BAD_REQUEST);
    }

    @Test
    @DisplayName("QNA(7) without tags -> Success")
    void createQnaWithoutTags() {
        // Given
        CreateCommunityCommand command = new CreateCommunityCommand(
                1L, 7, "QNA Title", "Question?", Collections.emptyList()
        );
        given(saveCommunityPort.save(any(Community.class))).willReturn(11L);

        // When
        CreateCommunityResult result = createCommunityService.create(command);

        // Then
        assertThat(result.communityId()).isEqualTo(11L);
    }

    @Test
    @DisplayName("FREE(2) does NOT allow tags -> Fail")
    void createFreeWithTags_Fails() {
        // Given
        CreateCommunityCommand command = new CreateCommunityCommand(
                1L, 2, "Free Talk", "Chit chat", List.of("ForbiddenTag")
        );

        // When & Then
        assertThatThrownBy(() -> createCommunityService.create(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.BAD_REQUEST);
    }

    @Test
    @DisplayName("FREE(2) without tags -> Success")
    void createFreeWithoutTags() {
        // Given
        CreateCommunityCommand command = new CreateCommunityCommand(
                1L, 2, "Free Talk", "Just talking", Collections.emptyList()
        );
        given(saveCommunityPort.save(any(Community.class))).willReturn(12L);

        // When
        CreateCommunityResult result = createCommunityService.create(command);

        // Then
        assertThat(result.communityId()).isEqualTo(12L);
    }
}
