package com.b205.ozazak.application.essay.port.in;

import com.b205.ozazak.application.essay.command.UpdateEssayCommand;
import com.b205.ozazak.application.essay.result.UpdateEssayResult;

public interface UpdateEssayUseCase {
    UpdateEssayResult execute(UpdateEssayCommand command);
}
