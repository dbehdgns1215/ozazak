package com.b205.ozazak.application.essay.port.in;

import com.b205.ozazak.application.essay.command.DeleteEssayCommand;
import com.b205.ozazak.application.essay.result.DeleteEssayResult;

public interface DeleteEssayUseCase {
    DeleteEssayResult execute(DeleteEssayCommand command);
}
