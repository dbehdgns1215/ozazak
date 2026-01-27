package com.b205.ozazak.application.coverletter.port.in;

import com.b205.ozazak.application.coverletter.command.GetCoverletterDetailCommand;
import com.b205.ozazak.application.coverletter.result.CoverletterDetailResult;

public interface GetCoverletterDetailUseCase {
    CoverletterDetailResult execute(GetCoverletterDetailCommand command);
}
