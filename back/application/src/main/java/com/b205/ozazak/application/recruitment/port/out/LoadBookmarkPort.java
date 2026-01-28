package com.b205.ozazak.application.recruitment.port.out;

import java.util.Set;

public interface LoadBookmarkPort {

    // 북마크 목록 조회
    Set<Long> loadBookmarkedRecruitmentIds(Long accountId);

    // 북마크 여부 확인
    boolean isBookmarked(Long accountId, Long recruitmentId);
}
