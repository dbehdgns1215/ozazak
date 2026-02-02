package com.b205.ozazak.presentation.community.update;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.community.port.in.UpdateCommunityUseCase;
import com.b205.ozazak.application.community.result.UpdateCommunityResult;
import com.b205.ozazak.presentation.community.CommunityControllerTestBase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UpdateCommunityController.class)
class UpdateCommunityControllerTest extends CommunityControllerTestBase {

    @MockBean
    private UpdateCommunityUseCase updateCommunityUseCase;

    @Test
    @DisplayName("PUT /community/{id} with valid data returns 200")
    void updateCommunity_ValidData_Returns200() throws Exception {
        // Given
        Long communityId = 123L;
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(1L, "test@example.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        given(updateCommunityUseCase.update(any())).willReturn(new UpdateCommunityResult(communityId));

        String requestBody = """
            {
                "communityCode": 1,
                "title": "Updated Title",
                "content": "Updated Content",
                "tags": ["updated"]
            }
            """;

        // When & Then
        mockMvc.perform(put("/api/community/{communityId}", communityId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.communityId").value(123));
    }
}
