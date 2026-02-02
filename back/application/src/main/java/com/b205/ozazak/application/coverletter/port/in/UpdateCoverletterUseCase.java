package com.b205.ozazak.application.coverletter.port.in;

import com.b205.ozazak.application.coverletter.command.UpdateCoverletterCommand;
import com.b205.ozazak.application.coverletter.result.UpdateCoverletterResult;

public interface UpdateCoverletterUseCase {
    UpdateCoverletterResult execute(UpdateCoverletterCommand command);
}
