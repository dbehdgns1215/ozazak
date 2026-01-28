package com.b205.ozazak.presentation.comment.update;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.comment.port.in.UpdateCommentUseCase;
import com.b205.ozazak.application.comment.result.UpdateCommentResult;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UpdateCommentController.class)
class UpdateCommentControllerTest extends CommunityControllerTestBase {

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UpdateCommentUseCase updateCommentUseCase;

    @Test
    @DisplayName("Unauthenticated request returns 401")
    void unauthenticated_returns401() throws Exception {
        String requestBody = """
            { "content": "Updated" }
            """;

        mockMvc.perform(put("/api/community-comments/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("Blank content returns 400")
    void blankContent_returns400() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));

        String requestBody = """
            { "content": "" }
            """;

        mockMvc.perform(put("/api/community-comments/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Forbidden update returns 403")
    void forbidden_returns403() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(updateCommentUseCase.update(any()))
                .willThrow(new CommunityException(CommunityErrorCode.FORBIDDEN));

        String requestBody = """
            { "content": "Updated" }
            """;

        mockMvc.perform(put("/api/community-comments/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Success returns 200 with commentId")
    void success_returns200() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(updateCommentUseCase.update(any())).willReturn(new UpdateCommentResult(1L));

        String requestBody = """
            { "content": "Updated" }
            """;

        mockMvc.perform(put("/api/community-comments/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.commentId").value(1));
    }
}
