package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.application.community.port.out.dto.CommunityAuthorProjection;

/**
 * Port for loading minimal community data for update checks.
 */
public interface LoadCommunityForUpdatePort {
    /**
     * Loads the author ID for the given community ID.
     * @param communityId Target community ID
     * @return Projection containing author ID, or null if not found
     */
    CommunityAuthorProjection loadForUpdate(Long communityId);
}
