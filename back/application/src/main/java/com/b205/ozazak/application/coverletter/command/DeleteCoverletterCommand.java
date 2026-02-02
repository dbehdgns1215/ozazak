package com.b205.ozazak.application.coverletter.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteCoverletterCommand {
    private final Long coverletterId;
    private final Long accountId;  // 소유권 검증용
}
