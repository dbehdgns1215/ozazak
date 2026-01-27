package com.b205.ozazak.application.community.command;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UpdateCommunityCommand {
    private final Long accountId;
    private final Long communityId;
    private final Integer communityCode;
    private final String title;
    private final String content;
    private final List<String> tags;
}
