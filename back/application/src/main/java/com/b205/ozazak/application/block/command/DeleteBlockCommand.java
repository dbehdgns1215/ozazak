package com.b205.ozazak.application.block.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteBlockCommand {
    private final Long blockId;
    private final Long accountId;
}
