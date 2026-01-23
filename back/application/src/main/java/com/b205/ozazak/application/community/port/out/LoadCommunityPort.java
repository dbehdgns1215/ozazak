package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.domain.community.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface LoadCommunityPort {
    Optional<Community> loadCommunity(Long communityId);
    Page<Community> findSummaries(Pageable pageable);
}
