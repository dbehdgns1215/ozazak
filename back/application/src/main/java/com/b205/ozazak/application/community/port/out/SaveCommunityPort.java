package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.domain.community.entity.Community;

/**
 * Port for persisting Community aggregate.
 */
public interface SaveCommunityPort {
    /**
     * Persists the given Community aggregate.
     * <ul>
     *   <li><b>Insert</b>: If {@code community.getId()} is null, creates a new record.</li>
     *   <li><b>Update</b>: If {@code community.getId()} exists, updates the existing record.</li>
     * </ul>
     *
     * @param community the Community aggregate to persist
     * @return the persisted community's ID
     */
    Long save(Community community);
}
