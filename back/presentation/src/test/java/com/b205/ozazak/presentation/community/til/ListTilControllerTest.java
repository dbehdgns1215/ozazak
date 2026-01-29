package com.b205.ozazak.presentation.community.til;

import com.b205.ozazak.application.community.port.in.ListTilUseCase;
import com.b205.ozazak.application.community.result.ListTilResult;
import com.b205.ozazak.application.community.result.PageInfoResult;
import com.b205.ozazak.application.community.result.TilItemResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Controller tests for TIL list API
 */
@WebMvcTest(ListTilController.class)
@AutoConfigureMockMvc(addFilters = false)
class ListTilControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ListTilUseCase listTilUseCase;

    @Test
    @DisplayName("GET /api/til - default parameters should work")
    void testListTil_DefaultParameters() throws Exception {
        // Given
        ListTilResult mockResult = createMockResult();
        when(listTilUseCase.list(any())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(get("/api/til"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items").isArray())
                .andExpect(jsonPath("$.data.items.length()").value(1))
                .andExpect(jsonPath("$.data.items[0].tilId").value(1))
                .andExpect(jsonPath("$.data.items[0].title").value("Test TIL"))
                .andExpect(jsonPath("$.data.items[0].author.accountId").value(100))
                .andExpect(jsonPath("$.data.items[0].author.companyName").value("Test Company"))
                .andExpect(jsonPath("$.data.items[0].reaction").isArray())
                .andExpect(jsonPath("$.data.pageInfo.currentPage").value(0))
                .andExpect(jsonPath("$.data.pageInfo.pageSize").value(10));
    }

    @Test
    @DisplayName("GET /api/til?tags=spring,jpa - tag parsing should work")
    void testListTil_WithTags() throws Exception {
        // Given
        ListTilResult mockResult = createMockResult();
        when(listTilUseCase.list(any())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(get("/api/til")
                        .param("tags", "spring,jpa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].tags").isArray())
                .andExpect(jsonPath("$.data.items[0].tags[0]").value("spring"));
    }

    @Test
    @DisplayName("GET /api/til?page=-1 - negative page should return 400")
    void testListTil_NegativePage() throws Exception {
        mockMvc.perform(get("/api/til")
                        .param("page", "-1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/til?size=101 - size exceeding limit should return 400")
    void testListTil_SizeExceedingLimit() throws Exception {
        mockMvc.perform(get("/api/til")
                        .param("size", "101"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/til?authorStatus=invalid - invalid author-status should return 400")
    void testListTil_InvalidAuthorStatus() throws Exception {
        mockMvc.perform(get("/api/til")
                        .param("authorStatus", "invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/til?authorStatus=passed - valid author-status should work")
    void testListTil_ValidAuthorStatus() throws Exception {
        // Given
        ListTilResult mockResult = createMockResult();
        when(listTilUseCase.list(any())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(get("/api/til")
                        .param("authorStatus", "passed"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Response contract - companyName should be nullable")
    void testListTil_CompanyNameNullable() throws Exception {
        // Given
        ListTilResult mockResult = createMockResultWithoutCompany();
        when(listTilUseCase.list(any())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(get("/api/til"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].author.companyName").isEmpty());
    }

    @Test
    @DisplayName("Response contract - reaction array format")
    void testListTil_ReactionArrayFormat() throws Exception {
        // Given
        ListTilResult mockResult = createMockResult();
        when(listTilUseCase.list(any())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(get("/api/til"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].reaction").isArray())
                .andExpect(jsonPath("$.data.items[0].reaction[0].type").value(1))
                .andExpect(jsonPath("$.data.items[0].reaction[0].count").value(5));
    }

    // Helper methods
    private ListTilResult createMockResult() {
        TilItemResult.AuthorInfo author = TilItemResult.AuthorInfo.builder()
                .accountId(100L)
                .name("Test Author")
                .img("author.jpg")
                .companyName("Test Company")
                .build();

        TilItemResult.ReactionInfo reaction = TilItemResult.ReactionInfo.builder()
                .type(1)
                .count(5L)
                .build();

        TilItemResult item = TilItemResult.builder()
                .tilId(1L)
                .title("Test TIL")
                .content("Test content")
                .author(author)
                .tags(List.of("spring", "jpa"))
                .view(10)
                .commentCount(3L)
                .reactions(List.of(reaction))
                .createdAt(LocalDateTime.now())
                .build();

        PageInfoResult pageInfo = PageInfoResult.builder()
                .currentPage(0)
                .pageSize(10)
                .totalElements(1L)
                .totalPages(1)
                .hasNext(false)
                .hasPrevious(false)
                .build();

        return ListTilResult.builder()
                .items(List.of(item))
                .pageInfo(pageInfo)
                .build();
    }

    private ListTilResult createMockResultWithoutCompany() {
        TilItemResult.AuthorInfo author = TilItemResult.AuthorInfo.builder()
                .accountId(100L)
                .name("Test Author")
                .img("author.jpg")
                .companyName(null)  // No company
                .build();

        TilItemResult item = TilItemResult.builder()
                .tilId(1L)
                .title("Test TIL")
                .content("Test content")
                .author(author)
                .tags(List.of())
                .view(10)
                .commentCount(0L)
                .reactions(List.of())
                .createdAt(LocalDateTime.now())
                .build();

        PageInfoResult pageInfo = PageInfoResult.builder()
                .currentPage(0)
                .pageSize(10)
                .totalElements(1L)
                .totalPages(1)
                .hasNext(false)
                .hasPrevious(false)
                .build();

        return ListTilResult.builder()
                .items(List.of(item))
                .pageInfo(pageInfo)
                .build();
    }
}
