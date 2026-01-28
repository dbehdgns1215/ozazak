package com.b205.ozazak.presentation.community.view;

import com.b205.ozazak.application.community.port.in.GetCommunityUseCase;
import com.b205.ozazak.application.community.result.GetCommunityResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = GetCommunityController.class)
class GetCommunityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetCommunityUseCase getCommunityUseCase;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Community Detail API - Success")
    void getCommunity_Success() throws Exception {
        // Given
        GetCommunityResult mockResult = GetCommunityResult.builder()
                .communityId(10L)
                .title("Detail Post")
                .content("Detail Content")
                .authorName("Author")
                .tags(List.of("spring"))
                .reactions(Collections.emptyList())
                .createdAt(LocalDateTime.now())
                .build();

        given(getCommunityUseCase.get(10L)).willReturn(mockResult);

        // When & Then
        mockMvc.perform(get("/api/community/10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.communityId").value(10))
                .andExpect(jsonPath("$.data.title").value("Detail Post"));
    }
}
