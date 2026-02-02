package com.b205.ozazak.application.coverletter.port.in;

import com.b205.ozazak.application.coverletter.command.CreateCoverletterCommand;
import com.b205.ozazak.application.coverletter.result.CreateCoverletterResult;

public interface CreateCoverletterUseCase {
    CreateCoverletterResult execute(CreateCoverletterCommand command);
}
