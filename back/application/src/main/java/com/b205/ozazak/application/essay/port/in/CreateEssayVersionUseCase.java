package com.b205.ozazak.application.essay.port.in;

import com.b205.ozazak.application.essay.command.CreateEssayVersionCommand;
import com.b205.ozazak.application.essay.result.CreateEssayVersionResult;

public interface CreateEssayVersionUseCase {
    CreateEssayVersionResult execute(CreateEssayVersionCommand command);
}
