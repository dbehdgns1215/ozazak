package com.b205.ozazak.domain.company.vo;

public enum CompanySize {
    // 임시
    LARGE(1, "대기업"),
    MIDDLE(2, "중견기업"),
    SME(3, "중소기업"),
    PUBLIC(4, "공기업"),
    STARTUP(5, "스타트업"),
    FOREIGN(6, "외국계");

    private final int code;
    private final String description;

    CompanySize(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static CompanySize fromCode(Integer code) {
        if (code == null)
            return null;
        for (CompanySize size : values()) {
            if (size.code == code) {
                return size;
            }
        }
        return null;
    }
}
