package com.b205.ozazak.application.block.result;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DeleteBlockResult {
    private final Long blockId;
    private final LocalDateTime deletedAt;
}
