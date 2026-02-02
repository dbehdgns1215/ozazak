package com.b205.ozazak.application.comment.service;

import com.b205.ozazak.application.comment.command.CreateCommentCommand;
import com.b205.ozazak.application.comment.port.out.SaveCommentPort;
import com.b205.ozazak.application.comment.result.CreateCommentResult;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.LoadCommunityPort;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.community.vo.CommunityId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CreateCommentServiceTest {

    @Mock
    private LoadCommunityPort loadCommunityPort;

    @Mock
    private SaveCommentPort saveCommentPort;

    @InjectMocks
    private CreateCommentService createCommentService;

    @Test
    @DisplayName("Success: returns created commentId")
    void create_success_returnsCommentId() {
        // Given
        Long communityId = 1L;
        Long authorAccountId = 100L;
        String content = "Test comment";
        Long expectedCommentId = 10L;

        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .build();

        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));
        given(saveCommentPort.save(communityId, authorAccountId, content)).willReturn(expectedCommentId);

        CreateCommentCommand command = CreateCommentCommand.builder()
                .communityId(communityId)
                .authorAccountId(authorAccountId)
                .content(content)
                .build();

        // When
        CreateCommentResult result = createCommentService.create(command);

        // Then
        assertThat(result.getCommentId()).isEqualTo(expectedCommentId);
    }

    @Test
    @DisplayName("Community not found: throws 404")
    void create_communityNotFound_throws404() {
        // Given
        Long communityId = 999L;

        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.empty());

        CreateCommentCommand command = CreateCommentCommand.builder()
                .communityId(communityId)
                .authorAccountId(100L)
                .content("Test comment")
                .build();

        // When & Then
        assertThatThrownBy(() -> createCommentService.create(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);
    }
}
