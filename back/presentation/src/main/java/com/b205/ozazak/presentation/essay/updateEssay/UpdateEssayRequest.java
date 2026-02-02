package com.b205.ozazak.presentation.essay.updateEssay;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // Jackson deserialization
public class UpdateEssayRequest {
    
    @NotBlank(message = "내용은 필수입니다")
    private String content;
    
    // versionTitle은 선택 (없으면 기존 유지)
    private String versionTitle;
}
