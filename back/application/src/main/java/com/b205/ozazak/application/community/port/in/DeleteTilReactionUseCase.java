package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.command.DeleteTilReactionCommand;

public interface DeleteTilReactionUseCase {
    /**
     * Delete a reaction for a TIL.
     * @param command Command containing reaction details
     * @throws com.b205.ozazak.application.community.exception.CommunityException if TIL not found
     */
    void deleteReaction(DeleteTilReactionCommand command);
}
