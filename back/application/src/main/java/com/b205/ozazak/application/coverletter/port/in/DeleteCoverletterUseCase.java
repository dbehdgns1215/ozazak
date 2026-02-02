package com.b205.ozazak.application.coverletter.port.in;

import com.b205.ozazak.application.coverletter.command.DeleteCoverletterCommand;
import com.b205.ozazak.application.coverletter.result.DeleteCoverletterResult;

public interface DeleteCoverletterUseCase {
    DeleteCoverletterResult execute(DeleteCoverletterCommand command);
}
