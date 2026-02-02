package com.b205.ozazak.application.block.port.in;

import com.b205.ozazak.application.block.command.DeleteBlockCommand;
import com.b205.ozazak.application.block.result.DeleteBlockResult;

public interface DeleteBlockUseCase {
    DeleteBlockResult execute(DeleteBlockCommand command);
}
