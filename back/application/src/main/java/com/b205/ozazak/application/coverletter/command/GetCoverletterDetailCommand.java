package com.b205.ozazak.application.coverletter.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetCoverletterDetailCommand {
    private final Long accountId;
    private final Long coverletterId;
}
