package com.b205.ozazak.application.block.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetBlockListCommand {
    private final Long accountId;
    private final Integer category;   // nullable
    private final String keyword;     // nullable
    private final int page;
    private final int size;
}
