package com.b205.ozazak.application.community.command;

public record DeleteTilReactionCommand(
    Long tilId,
    Long accountId,
    Integer reactionType
) {
    public DeleteTilReactionCommand {
        if (tilId == null) throw new IllegalArgumentException("TIL ID cannot be null");
        if (accountId == null) throw new IllegalArgumentException("Account ID cannot be null");
        if (reactionType == null) throw new IllegalArgumentException("Reaction type cannot be null");
    }
}
