package com.b205.ozazak.application.comment.service;

import com.b205.ozazak.application.comment.port.out.LoadCommentListPort;
import com.b205.ozazak.application.comment.port.out.dto.CommentRow;
import com.b205.ozazak.application.comment.query.ListCommentQuery;
import com.b205.ozazak.application.comment.result.ListCommentResult;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class ListCommentServiceTest {

    @Mock
    private LoadCommunityPort loadCommunityPort;

    @Mock
    private LoadCommentListPort loadCommentListPort;

    @InjectMocks
    private ListCommentService listCommentService;

    @Test
    @DisplayName("isMine is true when viewer matches author")
    void isMine_whenViewerMatchesAuthor_returnsTrue() {
        // Given
        Long communityId = 1L;
        Long viewerAccountId = 100L;
        
        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .build();

        CommentRow comment = CommentRow.builder()
                .commentId(10L)
                .authorId(viewerAccountId)  // Same as viewer
                .authorName("TestUser")
                .authorImg("img.jpg")
                .content("Test comment")
                .createdAt(LocalDateTime.now())
                .build();

        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));
        given(loadCommentListPort.loadByCommunityId(communityId)).willReturn(List.of(comment));

        ListCommentQuery query = ListCommentQuery.builder()
                .communityId(communityId)
                .viewerAccountId(viewerAccountId)
                .build();

        // When
        ListCommentResult result = listCommentService.list(query);

        // Then
        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).isMine()).isTrue();
    }

    @Test
    @DisplayName("isMine is false when viewer does not match author")
    void isMine_whenViewerMismatchesAuthor_returnsFalse() {
        // Given
        Long communityId = 1L;
        Long viewerAccountId = 100L;
        Long authorId = 200L;  // Different from viewer

        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .build();

        CommentRow comment = CommentRow.builder()
                .commentId(10L)
                .authorId(authorId)
                .authorName("OtherUser")
                .authorImg("img.jpg")
                .content("Test comment")
                .createdAt(LocalDateTime.now())
                .build();

        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));
        given(loadCommentListPort.loadByCommunityId(communityId)).willReturn(List.of(comment));

        ListCommentQuery query = ListCommentQuery.builder()
                .communityId(communityId)
                .viewerAccountId(viewerAccountId)
                .build();

        // When
        ListCommentResult result = listCommentService.list(query);

        // Then
        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).isMine()).isFalse();
    }

    @Test
    @DisplayName("isMine is false for anonymous user")
    void isMine_whenAnonymous_returnsFalse() {
        // Given
        Long communityId = 1L;

        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .build();

        CommentRow comment = CommentRow.builder()
                .commentId(10L)
                .authorId(100L)
                .authorName("TestUser")
                .authorImg("img.jpg")
                .content("Test comment")
                .createdAt(LocalDateTime.now())
                .build();

        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));
        given(loadCommentListPort.loadByCommunityId(communityId)).willReturn(List.of(comment));

        ListCommentQuery query = ListCommentQuery.builder()
                .communityId(communityId)
                .viewerAccountId(null)  // Anonymous
                .build();

        // When
        ListCommentResult result = listCommentService.list(query);

        // Then
        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).isMine()).isFalse();
    }

    @Test
    @DisplayName("Empty comment list returns empty items")
    void emptyCommentList_returnsEmptyItems() {
        // Given
        Long communityId = 1L;

        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .build();

        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));
        given(loadCommentListPort.loadByCommunityId(communityId)).willReturn(Collections.emptyList());

        ListCommentQuery query = ListCommentQuery.builder()
                .communityId(communityId)
                .viewerAccountId(100L)
                .build();

        // When
        ListCommentResult result = listCommentService.list(query);

        // Then
        assertThat(result.getItems()).isEmpty();
        assertThat(result.getPageInfo()).isNull();
    }

    @Test
    @DisplayName("Community not found throws NOT_FOUND exception")
    void communityNotFound_throwsNotFound() {
        // Given
        Long communityId = 999L;

        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.empty());

        ListCommentQuery query = ListCommentQuery.builder()
                .communityId(communityId)
                .viewerAccountId(100L)
                .build();

        // When & Then
        assertThatThrownBy(() -> listCommentService.list(query))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.NOT_FOUND);
    }

    @Test
    @DisplayName("Stable ordering: same createdAt ordered by commentId ASC")
    void stableOrdering_sameCreatedAt_orderedByCommentId() {
        // Given
        Long communityId = 1L;
        LocalDateTime sameTime = LocalDateTime.of(2026, 1, 1, 10, 0, 0);

        Community community = Community.builder()
                .id(new CommunityId(communityId))
                .build();

        // Comments with same createdAt but different commentIds
        CommentRow comment1 = CommentRow.builder()
                .commentId(10L)  // Lower ID
                .authorId(100L)
                .authorName("User1")
                .authorImg("img1.jpg")
                .content("First comment")
                .createdAt(sameTime)
                .build();

        CommentRow comment2 = CommentRow.builder()
                .commentId(20L)  // Higher ID
                .authorId(200L)
                .authorName("User2")
                .authorImg("img2.jpg")
                .content("Second comment")
                .createdAt(sameTime)
                .build();

        // Repository returns in stable order (createdAt ASC, commentId ASC)
        given(loadCommunityPort.loadCommunity(communityId)).willReturn(Optional.of(community));
        given(loadCommentListPort.loadByCommunityId(communityId)).willReturn(List.of(comment1, comment2));

        ListCommentQuery query = ListCommentQuery.builder()
                .communityId(communityId)
                .viewerAccountId(null)
                .build();

        // When
        ListCommentResult result = listCommentService.list(query);

        // Then - order preserved from repository
        assertThat(result.getItems()).hasSize(2);
        assertThat(result.getItems().get(0).getCommentId()).isEqualTo(10L);
        assertThat(result.getItems().get(1).getCommentId()).isEqualTo(20L);
    }
}

