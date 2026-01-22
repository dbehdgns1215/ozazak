package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.domain.community.entity.Community;
import java.util.Optional;

public interface LoadCommunityPort {
    Optional<Community> loadCommunity(Long communityId);
}
