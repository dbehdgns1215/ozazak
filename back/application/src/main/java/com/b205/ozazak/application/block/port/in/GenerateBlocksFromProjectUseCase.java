package com.b205.ozazak.application.block.port.in;

import com.b205.ozazak.application.block.command.GenerateBlocksFromProjectCommand;
import com.b205.ozazak.application.block.result.GenerateBlocksResult;

public interface GenerateBlocksFromProjectUseCase {
    GenerateBlocksResult execute(GenerateBlocksFromProjectCommand command);
}
