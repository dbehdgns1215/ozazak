package com.b205.ozazak.application.essay.port.in;

import com.b205.ozazak.application.essay.command.AIGenerateEssayBatchCommand;
import com.b205.ozazak.application.essay.result.AIGenerateEssayBatchResult;

public interface AIGenerateEssayBatchUseCase {
    AIGenerateEssayBatchResult execute(AIGenerateEssayBatchCommand command);
}
