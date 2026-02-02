package com.b205.ozazak.presentation.comment.create;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.comment.port.in.CreateCommentUseCase;
import com.b205.ozazak.application.comment.result.CreateCommentResult;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.presentation.community.CommunityControllerTestBase;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CreateCommentController.class)
class CreateCommentControllerTest extends CommunityControllerTestBase {

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CreateCommentUseCase createCommentUseCase;

    @Test
    @DisplayName("Unauthenticated request returns 401")
    void unauthenticated_returns401() throws Exception {
        // Given - no token
        String requestBody = """
            { "content": "Test comment" }
            """;

        // When & Then
        mockMvc.perform(post("/api/community-posts/1/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("Blank content returns 400")
    void blankContent_returns400() throws Exception {
        // Given
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));

        String requestBody = """
            { "content": "" }
            """;

        // When & Then
        mockMvc.perform(post("/api/community-posts/1/comments")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Community not found returns 404")
    void communityNotFound_returns404() throws Exception {
        // Given
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(createCommentUseCase.create(any()))
                .willThrow(new CommunityException(CommunityErrorCode.NOT_FOUND));

        String requestBody = """
            { "content": "Test comment" }
            """;

        // When & Then
        mockMvc.perform(post("/api/community-posts/999/comments")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Success returns 201 with commentId")
    void success_returns201WithCommentId() throws Exception {
        // Given
        String token = "valid-token";
        Long expectedCommentId = 10L;
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(createCommentUseCase.create(any())).willReturn(new CreateCommentResult(expectedCommentId));

        String requestBody = """
            { "content": "Test comment" }
            """;

        // When & Then
        mockMvc.perform(post("/api/community-posts/1/comments")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.commentId").value(10));
    }
}
