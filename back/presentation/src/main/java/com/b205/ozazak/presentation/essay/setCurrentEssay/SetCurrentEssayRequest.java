package com.b205.ozazak.presentation.essay.setCurrentEssay;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // Jackson deserialization
public class SetCurrentEssayRequest {
    
    @NotNull(message = "이전 현재 버전 ID는 필수입니다")
    private Long previousCurrentEssayId;
}
