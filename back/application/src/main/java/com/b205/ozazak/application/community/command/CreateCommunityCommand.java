package com.b205.ozazak.application.community.command;

import java.util.List;

public record CreateCommunityCommand(
    Long accountId,
    Integer communityCode,
    String title,
    String content,
    List<String> tags
) {
}
