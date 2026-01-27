package com.b205.ozazak.application.community.port.out;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.b205.ozazak.application.community.result.CommunitySummaryResult;

public interface LoadCommunityListPort {
    Page<CommunitySummaryResult> loadCommunitySummaries(Pageable pageable);
}
