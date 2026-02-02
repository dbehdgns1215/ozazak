package com.b205.ozazak.application.essay.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateEssayVersionResult {
    private final Long essayId;
    private final Integer version;
    private final String versionTitle;
    private final String content;
    private final Long baseEssayId;  // 분기점 추적용
}
