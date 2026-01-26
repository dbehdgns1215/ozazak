package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.CreateCommunityCommand;
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
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CreateCommunityServiceTest {

    @Mock
    private SaveCommunityPort saveCommunityPort;

    @InjectMocks
    private CreateCommunityService service;

    @Test
    @DisplayName("TIL post with tags should succeed")
    void create_TilWithTags_Success() {
        // Given: TIL (code=1) with tags
        CreateCommunityCommand command = new CreateCommunityCommand(
                1L, 1, "TIL Title", "Content", List.of("spring", "jpa")
        );
        given(saveCommunityPort.save(any(Community.class))).willReturn(100L);

        // When
        CreateCommunityResult result = service.create(command);

        // Then
        assertThat(result.communityId()).isEqualTo(100L);
        verify(saveCommunityPort).save(any(Community.class));
    }

    @Test
    @DisplayName("Non-TIL post with empty tags should succeed")
    void create_NonTilWithEmptyTags_Success() {
        // Given: Non-TIL (code=2) with empty tags
        CreateCommunityCommand command = new CreateCommunityCommand(
                1L, 2, "Title", "Content", Collections.emptyList()
        );
        given(saveCommunityPort.save(any(Community.class))).willReturn(101L);

        // When
        CreateCommunityResult result = service.create(command);

        // Then
        assertThat(result.communityId()).isEqualTo(101L);
        verify(saveCommunityPort).save(any(Community.class));
    }

    @Test
    @DisplayName("Non-TIL post with tags should throw IllegalArgumentException")
    void create_NonTilWithTags_ThrowsException() {
        // Given: Non-TIL (code=2) with tags
        CreateCommunityCommand command = new CreateCommunityCommand(
                1L, 2, "Title", "Content", List.of("tag1")
        );

        // When & Then
        assertThatThrownBy(() -> service.create(command))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Tags are only allowed for TIL posts");
    }
}
