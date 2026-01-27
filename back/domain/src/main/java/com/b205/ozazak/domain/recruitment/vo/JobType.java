package com.b205.ozazak.domain.recruitment.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum JobType {
    REGULAR(0, "정규직"),
    CONTRACT(1, "계약직"),
    INTERN(2, "인턴"),
    DISPATCH(3, "파견직"),
    FREELANCE(4, "프리랜서");

    private final int code;
    private final String displayName;

    public static JobType fromCode(int code) {
        return Arrays.stream(values())
                .filter(type -> type.getCode() == code)
                .findFirst()
                .orElse(null); // Return null if unknown code
    }
}
