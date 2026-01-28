package com.b205.ozazak.application.community.port.out;

public interface ManageReactionPort {
    /**
     * Add a reaction. Implementation must be idempotent (succeed if already exists).
     */
    void addReaction(Long tilId, Long accountId, Integer type);

    /**
     * Remove a reaction. Implementation must be idempotent (succeed if not exists).
     */
    void removeReaction(Long tilId, Long accountId, Integer type);
}
