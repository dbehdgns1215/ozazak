package com.b205.ozazak.domain.community.vo;

/**
 * Community post types.
 * Each type has different rules (e.g., TIL allows tags, others don't).
 */
public enum CommunityType {
    TIL(1),
    FREE(2),
    HOT(3),
    REVIEW(4),
    RESUME(5),
    STUDY(6),
    QNA(7);

    private final int code;

    CommunityType(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static CommunityType fromCode(int code) {
        for (CommunityType type : values()) {
            if (type.code == code) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid community code: " + code);
    }

    public boolean isTil() {
        return this == TIL;
    }

    public boolean allowsTags() {
        return this == TIL;
    }
}
