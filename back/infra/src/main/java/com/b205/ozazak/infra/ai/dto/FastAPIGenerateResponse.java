package com.b205.ozazak.infra.ai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FastAPIGenerateResponse {
    private String content;
    private String error;  // nullable, 에러 발생 시
}
