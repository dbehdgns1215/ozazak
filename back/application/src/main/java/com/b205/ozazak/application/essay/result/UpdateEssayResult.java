package com.b205.ozazak.application.essay.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateEssayResult {
    private final Long essayId;         // Essay ID
    private final Integer version;      // 버전 번호
    private final String versionTitle;  // 버전 제목
    private final String content;       // 내용
}
