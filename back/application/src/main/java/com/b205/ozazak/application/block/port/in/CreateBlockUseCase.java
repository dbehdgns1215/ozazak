package com.b205.ozazak.application.block.port.in;

import com.b205.ozazak.application.block.command.CreateBlockCommand;
import com.b205.ozazak.application.block.result.CreateBlockResult;

public interface CreateBlockUseCase {
    CreateBlockResult execute(CreateBlockCommand command);
}
