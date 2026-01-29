package com.b205.ozazak.application.block.port.in;

import com.b205.ozazak.application.block.command.GetBlockListCommand;
import com.b205.ozazak.application.block.result.BlockListResult;

public interface GetBlockListUseCase {
    BlockListResult execute(GetBlockListCommand command);
}
