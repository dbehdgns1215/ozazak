package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.CreateTilReactionCommand;
import com.b205.ozazak.application.community.command.DeleteTilReactionCommand;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.in.CreateTilReactionUseCase;
import com.b205.ozazak.application.community.port.in.DeleteTilReactionUseCase;
import com.b205.ozazak.application.community.port.out.LoadTilExistencePort;
import com.b205.ozazak.application.community.port.out.ManageReactionPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TilReactionService implements CreateTilReactionUseCase, DeleteTilReactionUseCase {

    private final ManageReactionPort manageReactionPort;
    private final LoadTilExistencePort loadTilExistencePort;

    @Override
    public void createReaction(CreateTilReactionCommand command) {
        validateTilExistence(command.tilId());
        manageReactionPort.addReaction(command.tilId(), command.accountId(), command.reactionType());
    }

    @Override
    public void deleteReaction(DeleteTilReactionCommand command) {
        validateTilExistence(command.tilId());
        manageReactionPort.removeReaction(command.tilId(), command.accountId(), command.reactionType());
    }

    private void validateTilExistence(Long tilId) {
        // Check if TIL exists, has communityCode=1 (TIL), and is not deleted
        if (!loadTilExistencePort.existsActiveTil(tilId)) {
            throw new CommunityException(CommunityErrorCode.NOT_FOUND);
        }
    }
}
