package com.b205.ozazak.application.block.result;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GenerateBlocksResult {
    private final List<BlockDetailResult> blocks;
}
