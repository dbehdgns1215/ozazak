package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.application.community.command.UpdateCommunityParams;

/**
 * Outgoing port for persisting community updates.
 */
public interface UpdateCommunityPort {
    void update(Long communityId, UpdateCommunityParams params);
}
