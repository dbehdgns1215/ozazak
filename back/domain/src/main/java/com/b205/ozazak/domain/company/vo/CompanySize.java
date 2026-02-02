package com.b205.ozazak.domain.company.vo;

public enum CompanySize {
    // 임시
    STARTUP(0, "스타트업"),
    SME(1, "중소기업"),
    MIDDLE(2, "중견기업"),
    LARGE(3, "대기업"),
    PUBLIC(4, "공기업"),
    FOREIGN(5, "외국계");

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
