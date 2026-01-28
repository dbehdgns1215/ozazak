package com.b205.ozazak.presentation.community.delete;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.in.DeleteCommunityUseCase;
import com.b205.ozazak.application.community.result.DeleteCommunityResult;
import com.b205.ozazak.presentation.community.CommunityControllerTestBase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DeleteCommunityController.class)
class DeleteCommunityControllerTest extends CommunityControllerTestBase {

    @MockBean
    private DeleteCommunityUseCase deleteCommunityUseCase;

    @Test
    @DisplayName("DELETE /community/{id} with author returns 200")
    void deleteCommunity_Author_Returns200() throws Exception {
        // Given
        Long communityId = 123L;
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(1L, "test@example.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(deleteCommunityUseCase.delete(any())).willReturn(new DeleteCommunityResult(communityId));

        // When & Then
        mockMvc.perform(delete("/api/community/{communityId}", communityId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.communityId").value(123));
    }

    @Test
    @DisplayName("DELETE /community/{id} without token returns 401 with error envelope")
    void deleteCommunity_Unauthenticated_Returns401() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/community/{communityId}", 123L))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Authentication required"));
    }

    @Test
    @DisplayName("DELETE /community/{id} non-author/non-admin returns 403 with error envelope")
    void deleteCommunity_NonAuthorNonAdmin_Returns403() throws Exception {
        // Given
        Long communityId = 123L;
        String token = "other-user-token";
        CustomPrincipal principal = createUserPrincipal(200L, "other@example.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(deleteCommunityUseCase.delete(any())).willThrow(new CommunityException(CommunityErrorCode.FORBIDDEN));

        // When & Then
        mockMvc.perform(delete("/api/community/{communityId}", communityId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("DELETE /community/{id} non-existent returns 404 with error envelope")
    void deleteCommunity_NonExistent_Returns404() throws Exception {
        // Given
        Long communityId = 999L;
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(1L, "test@example.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(deleteCommunityUseCase.delete(any())).willThrow(new CommunityException(CommunityErrorCode.NOT_FOUND));

        // When & Then
        mockMvc.perform(delete("/api/community/{communityId}", communityId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"))
                .andExpect(jsonPath("$.message").exists());
    }
}
