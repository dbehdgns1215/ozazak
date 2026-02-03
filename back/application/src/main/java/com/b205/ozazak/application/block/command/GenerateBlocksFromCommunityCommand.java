package com.b205.ozazak.application.block.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GenerateBlocksFromCommunityCommand {
    private final Long accountId;
    private final Long communityId;
}
