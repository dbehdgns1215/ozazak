package com.b205.ozazak.presentation.auth;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.presentation.auth.config.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountMeController.class)
@Import(SecurityConfig.class)
class AccountMeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @DisplayName("401 Unauthorized when requesting /api/accounts/me without token")
    void getMe_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/accounts/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("200 OK when requesting /api/accounts/me with valid Bearer token")
    void getMe_Authenticated() throws Exception {
        // given
        String token = "valid-token";
        CustomPrincipal principal = new CustomPrincipal(1L, "test@example.com", "ROLE_USER");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));

        // when & then
        mockMvc.perform(get("/api/accounts/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.accountId").value(1))
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }
}
