package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.application.community.port.out.dto.CommunityDetail;
import java.util.Optional;

public interface LoadCommunityDetailPort {
    Optional<CommunityDetail> loadCommunityDetail(Long communityId);
}
