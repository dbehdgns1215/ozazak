package com.b205.ozazak.application.coverletter.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetCoverletterListCommand {
    private final Long accountId;
    private final int page;
    private final int size;
}
