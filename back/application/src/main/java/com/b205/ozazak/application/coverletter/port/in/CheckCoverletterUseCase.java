package com.b205.ozazak.application.coverletter.port.in;

import com.b205.ozazak.application.coverletter.command.CheckCoverletterCommand;
import com.b205.ozazak.application.coverletter.result.CheckCoverletterResult;

public interface CheckCoverletterUseCase {
    CheckCoverletterResult execute(CheckCoverletterCommand command);
}
