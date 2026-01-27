package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.command.CreateTilReactionCommand;

public interface CreateTilReactionUseCase {
    /**
     * Create a reaction for a TIL.
     * @param command Command containing reaction details
     * @throws com.b205.ozazak.application.community.exception.CommunityException if TIL not found
     */
    void createReaction(CreateTilReactionCommand command);
}
