package com.b205.ozazak.presentation.community.read;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.community.port.in.GetCommunityUseCase;
import com.b205.ozazak.application.community.result.GetCommunityResult;
import com.b205.ozazak.presentation.community.CommunityControllerTestBase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GetCommunityController.class)
class GetCommunityControllerTest extends CommunityControllerTestBase {

    @MockBean
    private GetCommunityUseCase getCommunityUseCase;

    @Test
    @DisplayName("GET /community/{id} returns 200 and community details")
    void getCommunity_Returns200() throws Exception {
        // Given
        Long communityId = 123L;
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(1L, "test@example.com");
        
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));
        
        // Mock specific result
        GetCommunityResult result = GetCommunityResult.builder()
                .communityId(communityId)
                .communityCode(1)
                .title("Test Community")
                .content("Content")
                .author(GetCommunityResult.AuthorInfo.builder()
                        .accountId(1L)
                        .name("Test Author")
                        .img("test.jpg")
                        .build())
                .build();
                
        given(getCommunityUseCase.getCommunity(communityId)).willReturn(result);

        // When & Then
        mockMvc.perform(get("/api/community/{communityId}", communityId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.communityId").value(communityId))
                .andExpect(jsonPath("$.data.title").value("Test Community"))
                .andExpect(jsonPath("$.data.author.name").value("Test Author"));
    }
}
