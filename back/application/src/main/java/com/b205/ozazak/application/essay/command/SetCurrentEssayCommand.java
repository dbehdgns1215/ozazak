package com.b205.ozazak.application.essay.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SetCurrentEssayCommand {
    private final Long targetEssayId;           // 새로 current로 설정할 essay
    private final Long previousCurrentEssayId;  // 이전 current (optional)
    private final Long accountId;               // 소유권 검증
}
