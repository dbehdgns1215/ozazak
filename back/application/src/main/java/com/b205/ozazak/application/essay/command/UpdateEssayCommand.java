package com.b205.ozazak.application.essay.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateEssayCommand {
    private final Long essayId;      // 수정할 Essay ID
    private final Long accountId;    // 인증된 사용자 (소유권 검증)
    private final String content;    // 새 내용
    private final String versionTitle;  // 버전 제목 (optional)
}
