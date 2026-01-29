package com.b205.ozazak.application.community.command;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Getter
@Builder
public class ListCommunityCommand {
    private final Integer communityCode;
    private final Long authorId;
    private final List<String> tags;
    private final Pageable pageable;
}
