package com.b205.ozazak.application.community.port.out;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Projection containing minimal information required for update authorization check.
 */
@Getter
@RequiredArgsConstructor
public class CommunityAuthorProjection {
    private final Long authorId;
}
