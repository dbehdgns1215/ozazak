package com.b205.ozazak.presentation.community.category.read;

import com.b205.ozazak.application.community.port.in.ListCommunityCategoryUseCase;
import com.b205.ozazak.application.community.result.ListCommunityCategoryResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ListCommunityCategoryController.class)
class ListCommunityCategoryControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean ListCommunityCategoryUseCase useCase;

    @Test
    @DisplayName("Should return wrapped response")
    void listCommunityCategory() throws Exception {
        // Given
        ListCommunityCategoryResult.CategoryItem item = ListCommunityCategoryResult.CategoryItem.builder()
                .communityCode(1)
                .title("TIL")
                .description("Desc")
                .totalPostCount(100L)
                .todayPostCount(10L)
                .build();
        given(useCase.list()).willReturn(ListCommunityCategoryResult.builder().items(List.of(item)).build());

        // When & Then
        mockMvc.perform(get("/api/community-category")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].communityCode").value(1))
                .andExpect(jsonPath("$.data.items[0].totalPostCount").value(100))
                .andExpect(jsonPath("$.data.items[0].todayPostCount").value(10));
    }
}
