package com.b205.ozazak.presentation.community.controller;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.application.community.port.in.CreateCommunityUseCase;
import com.b205.ozazak.application.community.result.CreateCommunityResult;
import com.b205.ozazak.presentation.auth.config.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CommunityWriteController.class)
@Import(SecurityConfig.class)
class CommunityWriteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CreateCommunityUseCase createCommunityUseCase;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @DisplayName("POST /community with valid JWT returns 201")
    void createCommunity_Authenticated_Returns201() throws Exception {
        // Given
        String token = "valid-token";
        CustomPrincipal principal = new CustomPrincipal(1L, "test@example.com", "ROLE_USER");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(createCommunityUseCase.create(any())).willReturn(new CreateCommunityResult(123L));

        String requestBody = """
            {
                "communityCode": 1,
                "title": "My TIL",
                "content": "Today I learned...",
                "tags": ["spring", "jpa"]
            }
            """;

        // When & Then
        mockMvc.perform(post("/api/community")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.communityId").value(123));
    }

    @Test
    @DisplayName("POST /community without token returns 401")
    void createCommunity_Unauthenticated_Returns401() throws Exception {
        String requestBody = """
            {
                "communityCode": 1,
                "title": "My TIL",
                "content": "Content",
                "tags": []
            }
            """;

        mockMvc.perform(post("/api/community")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /community with blank title returns 400")
    void createCommunity_BlankTitle_Returns400() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = new CustomPrincipal(1L, "test@example.com", "ROLE_USER");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));

        String requestBody = """
            {
                "communityCode": 1,
                "title": "",
                "content": "Content",
                "tags": []
            }
            """;

        mockMvc.perform(post("/api/community")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    @Test
    @DisplayName("POST /community with non-TIL + tags returns 400")
    void createCommunity_NonTilWithTags_Returns400() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = new CustomPrincipal(1L, "test@example.com", "ROLE_USER");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(createCommunityUseCase.create(any()))
                .willThrow(new IllegalArgumentException("Tags are only allowed for TIL posts"));

        String requestBody = """
            {
                "communityCode": 2,
                "title": "Non-TIL",
                "content": "Content",
                "tags": ["invalid"]
            }
            """;

        mockMvc.perform(post("/api/community")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.message").value("Tags are only allowed for TIL posts"));
    }
}
