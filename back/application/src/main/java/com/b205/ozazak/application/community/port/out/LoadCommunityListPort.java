package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.application.community.dto.CommunitySummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoadCommunityListPort {
    Page<CommunitySummaryDto> loadCommunitySummaries(Pageable pageable);
}
