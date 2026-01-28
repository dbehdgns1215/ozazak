package com.b205.ozazak.presentation.comment.list;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.comment.port.in.ListCommentUseCase;
import com.b205.ozazak.application.comment.query.ListCommentQuery;
import com.b205.ozazak.application.comment.result.ListCommentResult;
import com.b205.ozazak.application.comment.result.ListCommentResult.AuthorInfo;
import com.b205.ozazak.application.comment.result.ListCommentResult.CommentItemResult;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.presentation.community.CommunityControllerTestBase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ListCommentController.class)
class ListCommentControllerTest extends CommunityControllerTestBase {

    @MockBean
    private ListCommentUseCase listCommentUseCase;

    @Test
    @DisplayName("Anonymous request returns 200 with all isMine = false")
    void anonymousRequest_returns200WithAllIsMine_false() throws Exception {
        // Given
        CommentItemResult comment = CommentItemResult.builder()
                .commentId(1L)
                .author(AuthorInfo.builder()
                        .accountId(100L)
                        .name("TestUser")
                        .img("img.jpg")
                        .companyName("SSAFY")
                        .build())
                .content("Test comment")
                .createdAt(LocalDateTime.of(2026, 1, 1, 10, 0, 0))
                .updatedAt(null)
                .isMine(false)
                .build();

        ListCommentResult result = ListCommentResult.builder()
                .items(List.of(comment))
                .pageInfo(null)
                .build();

        given(listCommentUseCase.list(any(ListCommentQuery.class))).willReturn(result);

        // When & Then - anonymous (no token)
        mockMvc.perform(get("/api/community-posts/1/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].commentId").value(1))
                .andExpect(jsonPath("$.data.items[0].isMine").value(false))
                .andExpect(jsonPath("$.data.items[0].author.accountId").value(100))
                .andExpect(jsonPath("$.data.items[0].author.name").value("TestUser"))
                .andExpect(jsonPath("$.data.items[0].author.companyName").value("SSAFY"))
                .andExpect(jsonPath("$.data.pageInfo").doesNotExist());
    }

    @Test
    @DisplayName("Authenticated request returns 200 with own comment isMine = true")
    void authenticatedRequest_returnsOwnCommentWithIsMine_true() throws Exception {
        // Given
        Long viewerAccountId = 100L;
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(viewerAccountId, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        
        CommentItemResult ownComment = CommentItemResult.builder()
                .commentId(1L)
                .author(AuthorInfo.builder()
                        .accountId(viewerAccountId)
                        .name("MyUser")
                        .img("my-img.jpg")
                        .build())
                .content("My comment")
                .createdAt(LocalDateTime.of(2026, 1, 1, 10, 0, 0))
                .isMine(true)
                .build();

        CommentItemResult otherComment = CommentItemResult.builder()
                .commentId(2L)
                .author(AuthorInfo.builder()
                        .accountId(200L)
                        .name("OtherUser")
                        .img("other-img.jpg")
                        .build())
                .content("Other comment")
                .createdAt(LocalDateTime.of(2026, 1, 1, 11, 0, 0))
                .isMine(false)
                .build();

        ListCommentResult result = ListCommentResult.builder()
                .items(List.of(ownComment, otherComment))
                .pageInfo(null)
                .build();

        given(listCommentUseCase.list(any(ListCommentQuery.class))).willReturn(result);

        // When & Then
        mockMvc.perform(get("/api/community-posts/1/comments")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].isMine").value(true))
                .andExpect(jsonPath("$.data.items[1].isMine").value(false));
    }

    @Test
    @DisplayName("Non-existent community returns 404")
    void nonExistentCommunity_returns404() throws Exception {
        // Given
        given(listCommentUseCase.list(any(ListCommentQuery.class)))
                .willThrow(new CommunityException(CommunityErrorCode.NOT_FOUND));

        // When & Then
        mockMvc.perform(get("/api/community-posts/999/comments"))
                .andExpect(status().isNotFound());
    }
}

