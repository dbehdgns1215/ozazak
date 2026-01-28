package com.b205.ozazak.application.essay.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SetCurrentEssayResult {
    private final Long currentEssayId;
    private final Integer version;
}
