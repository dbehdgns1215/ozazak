package com.b205.ozazak.presentation.comment.delete;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.comment.port.in.DeleteCommentUseCase;
import com.b205.ozazak.application.comment.result.DeleteCommentResult;
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

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DeleteCommentController.class)
class DeleteCommentControllerTest extends CommunityControllerTestBase {

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DeleteCommentUseCase deleteCommentUseCase;

    @Test
    @DisplayName("Unauthenticated request returns 401")
    void unauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/api/community-comments/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("Forbidden delete returns 403")
    void forbidden_returns403() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(deleteCommentUseCase.delete(any()))
                .willThrow(new CommunityException(CommunityErrorCode.FORBIDDEN));

        mockMvc.perform(delete("/api/community-comments/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Deleted/Not Found returns 404")
    void notFound_returns404() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(deleteCommentUseCase.delete(any()))
                .willThrow(new CommunityException(CommunityErrorCode.NOT_FOUND));

        mockMvc.perform(delete("/api/community-comments/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Success returns 200 with deletedAt")
    void success_returns200() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        
        LocalDateTime now = LocalDateTime.now();
        given(deleteCommentUseCase.delete(any())).willReturn(new DeleteCommentResult(1L, now));

        mockMvc.perform(delete("/api/community-comments/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.commentId").value(1))
                .andExpect(jsonPath("$.data.deletedAt").exists());
    }
}
