package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.CreateTilReactionCommand;
import com.b205.ozazak.application.community.command.DeleteTilReactionCommand;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.out.LoadTilExistencePort;
import com.b205.ozazak.application.community.port.out.ManageReactionPort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class TilReactionServiceTest {

    @InjectMocks
    private TilReactionService tilReactionService;

    @Mock
    private ManageReactionPort manageReactionPort;

    @Mock
    private LoadTilExistencePort loadTilExistencePort;

    @Test
    @DisplayName("Create reaction succeeds when TIL exists")
    void createReaction_Success() {
        // given
        Long tilId = 1L;
        Long accountId = 10L;
        Integer type = 1;
        CreateTilReactionCommand command = new CreateTilReactionCommand(tilId, accountId, type);

        given(loadTilExistencePort.existsActiveTil(tilId)).willReturn(true);

        // when
        tilReactionService.createReaction(command);

        // then
        verify(manageReactionPort).addReaction(tilId, accountId, type);
    }

    @Test
    @DisplayName("Create reaction fails when TIL does not exist")
    void createReaction_NotFound() {
        // given
        Long tilId = 999L;
        CreateTilReactionCommand command = new CreateTilReactionCommand(tilId, 10L, 1);

        given(loadTilExistencePort.existsActiveTil(tilId)).willReturn(false);

        // when & then
        assertThatThrownBy(() -> tilReactionService.createReaction(command))
                .isInstanceOf(CommunityException.class)
                .extracting("errorCode")
                .isEqualTo(CommunityErrorCode.NOT_FOUND);
    }

    @Test
    @DisplayName("Delete reaction succeeds when TIL exists")
    void deleteReaction_Success() {
        // given
        Long tilId = 1L;
        Long accountId = 10L;
        Integer type = 1;
        DeleteTilReactionCommand command = new DeleteTilReactionCommand(tilId, accountId, type);

        given(loadTilExistencePort.existsActiveTil(tilId)).willReturn(true);

        // when
        tilReactionService.deleteReaction(command);

        // then
        verify(manageReactionPort).removeReaction(tilId, accountId, type);
    }
}
