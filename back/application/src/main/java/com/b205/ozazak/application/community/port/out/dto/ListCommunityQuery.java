package com.b205.ozazak.application.community.port.out.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Getter
@Builder
public class ListCommunityQuery {
    private final Integer communityCode;
    private final String authorName;
    private final List<String> tags;
    private final Pageable pageable;
}
