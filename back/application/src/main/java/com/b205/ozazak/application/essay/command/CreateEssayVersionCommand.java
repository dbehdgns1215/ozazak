package com.b205.ozazak.application.essay.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateEssayVersionCommand {
    private final Long baseEssayId;     // 기반이 되는 Essay ID
    private final Long accountId;       // 인증된 사용자 (소유권 검증)
    private final String content;       // 새 내용
    private final String versionTitle;  // 버전 제목 (optional)
}
