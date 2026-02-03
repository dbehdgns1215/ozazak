package com.b205.ozazak.application.block.port.in;

import com.b205.ozazak.application.block.command.GenerateBlocksFromCommunityCommand;
import com.b205.ozazak.application.block.result.GenerateBlocksResult;

public interface GenerateBlocksFromCommunityUseCase {
    GenerateBlocksResult execute(GenerateBlocksFromCommunityCommand command);
}
