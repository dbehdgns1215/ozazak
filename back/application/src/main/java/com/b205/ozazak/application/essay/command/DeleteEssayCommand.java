package com.b205.ozazak.application.essay.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteEssayCommand {
    private final Long essayId;
    private final Long accountId;  // 소유권 검증용
}
