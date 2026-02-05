package com.b205.ozazak.presentation.community.feed;

import com.b205.ozazak.application.community.command.ListCommunityCommand;
import com.b205.ozazak.application.community.port.in.ListCommunityUseCase;
import com.b205.ozazak.application.community.result.ListCommunityResult;
import com.b205.ozazak.presentation.community.feed.ListCommunityController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ListCommunityControllerTest {

    @Mock
    private ListCommunityUseCase listCommunityUseCase;

    @InjectMocks
    private ListCommunityController listCommunityController;

    @Test
    @DisplayName("Normal search keyword should succeed and be passed to command")
    void normalSearch() {
        // given
        String keyword = "test";
        when(listCommunityUseCase.list(any())).thenReturn(
            ListCommunityResult.builder()
                .items(Collections.emptyList())
                .resultPage(ListCommunityResult.PageInfo.builder()
                    .totalPage(1)
                    .currentPage(0)
                    .totalElements(0L)
                    .size(10)
                    .build())
                .build()
        );

        // when
        listCommunityController.list(null, null, keyword, null, Pageable.unpaged(), null);

        // then
        verify(listCommunityUseCase).list(argThat(cmd -> 
            cmd.getSearchKeyword().equals("test")
        ));
    }

    @Test
    @DisplayName("Keyword exceeding 100 chars should throw exception")
    void maxLengthExceeded() {
        // given
        String longKeyword = "a".repeat(101);

        // when & then
        assertThatThrownBy(() -> 
            listCommunityController.list(null, null, longKeyword, null, Pageable.unpaged(), null)
        ).isInstanceOf(com.b205.ozazak.application.community.exception.CommunityException.class)
         .hasFieldOrPropertyWithValue("errorCode", com.b205.ozazak.application.community.exception.CommunityErrorCode.BAD_REQUEST)
         .hasMessage("Search keyword must be 100 characters or less.");
    }

    @Test
    @DisplayName("Empty or whitespace keyword should be treated as null")
    void emptyOrWhitespace() {
        // given
        String keyword = "   ";
        when(listCommunityUseCase.list(any())).thenReturn(
            ListCommunityResult.builder()
                .items(Collections.emptyList())
                .resultPage(ListCommunityResult.PageInfo.builder().build())
                .build()
        );

        // when
        listCommunityController.list(null, null, keyword, null, Pageable.unpaged(), null);

        // then
        verify(listCommunityUseCase).list(argThat(cmd -> 
            cmd.getSearchKeyword() == null
        ));
    }

    @Test
    @DisplayName("Backslash in keyword should be passed literally to command (Escaping happens in Adapter)")
    void backslashSearch() {
        // given
        String keyword = "a\\b";
        when(listCommunityUseCase.list(any())).thenReturn(
            ListCommunityResult.builder()
                .items(Collections.emptyList())
                .resultPage(ListCommunityResult.PageInfo.builder().build())
                .build()
        );

        // when
        listCommunityController.list(null, null, keyword, null, Pageable.unpaged(), null);

        // then
        verify(listCommunityUseCase).list(argThat(cmd -> 
            cmd.getSearchKeyword().equals("a\\b")
        ));
    }
}
