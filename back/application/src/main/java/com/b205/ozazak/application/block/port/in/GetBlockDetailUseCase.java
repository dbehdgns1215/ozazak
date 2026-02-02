package com.b205.ozazak.application.block.port.in;

import com.b205.ozazak.application.block.command.GetBlockDetailCommand;
import com.b205.ozazak.application.block.result.BlockDetailResult;

public interface GetBlockDetailUseCase {
    BlockDetailResult execute(GetBlockDetailCommand command);
}
