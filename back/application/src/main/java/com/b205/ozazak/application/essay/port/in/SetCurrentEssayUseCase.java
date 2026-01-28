package com.b205.ozazak.application.essay.port.in;

import com.b205.ozazak.application.essay.command.SetCurrentEssayCommand;
import com.b205.ozazak.application.essay.result.SetCurrentEssayResult;

public interface SetCurrentEssayUseCase {
    SetCurrentEssayResult execute(SetCurrentEssayCommand command);
}
