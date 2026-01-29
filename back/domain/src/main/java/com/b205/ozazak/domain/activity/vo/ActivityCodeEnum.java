package com.b205.ozazak.domain.activity.vo;

public enum ActivityCodeEnum {
    AWARD(1, "수상"),
    CERTIFICATE(2, "자격증");

    private final Integer value;
    private final String description;

    ActivityCodeEnum(Integer value, String description) {
        this.value = value;
        this.description = description;
    }

    public Integer getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static ActivityCodeEnum fromValue(Integer value) {
        for (ActivityCodeEnum code : ActivityCodeEnum.values()) {
            if (code.value.equals(value)) {
                return code;
            }
        }
        throw new IllegalArgumentException("Invalid ActivityCode value: " + value);
    }
}
