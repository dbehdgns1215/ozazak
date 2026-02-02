package com.b205.ozazak.application.block.port.in;

import com.b205.ozazak.application.block.command.UpdateBlockCommand;
import com.b205.ozazak.application.block.result.UpdateBlockResult;

public interface UpdateBlockUseCase {
    UpdateBlockResult execute(UpdateBlockCommand command);
}
