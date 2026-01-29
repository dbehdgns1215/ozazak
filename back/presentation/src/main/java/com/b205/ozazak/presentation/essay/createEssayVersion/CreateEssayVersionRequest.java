package com.b205.ozazak.presentation.essay.createEssayVersion;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // Jackson deserialization
public class CreateEssayVersionRequest {
    
    @NotBlank(message = "내용은 필수입니다")
    private String content;
    
    // versionTitle은 선택 (없으면 "v{version}" 자동 생성)
    private String versionTitle;
}
