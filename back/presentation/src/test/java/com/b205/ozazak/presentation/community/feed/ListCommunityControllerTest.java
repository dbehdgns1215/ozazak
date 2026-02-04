package com.b205.ozazak.presentation.community.feed;

import com.b205.ozazak.application.community.command.ListCommunityCommand;
import com.b205.ozazak.application.community.port.in.ListCommunityUseCase;
import com.b205.ozazak.application.community.result.ListCommunityResult;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ListCommunityController.class)
class ListCommunityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ListCommunityUseCase listCommunityUseCase;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Community List API - Success")
    void listCommunity_Success() throws Exception {
        // Given
        ListCommunityResult mockResult = ListCommunityResult.builder()
                .items(List.of(ListCommunityResult.CommunityItem.builder()
                        .communityId(1L)
                        .title("Test Post")
                        .commentCount(0L)
                        .tags(java.util.List.of())
                        .reaction(java.util.List.of())
                        .userReaction(java.util.List.of())
                        .createdAt(java.time.LocalDateTime.now())
                        .build()))
                .resultPage(ListCommunityResult.PageInfo.builder()
                        .totalPage(1)
                        .currentPage(0)
                        .totalElements(1)
                        .size(10)
                        .build())
                .build();

        given(listCommunityUseCase.list(any(ListCommunityCommand.class))).willReturn(mockResult);

        // When & Then
        mockMvc.perform(get("/api/community")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items").isArray())
                .andExpect(jsonPath("$.data.items[0].title").value("Test Post"))
                .andExpect(jsonPath("$.data.page.totalElements").value(1));
    }
}
