package com.b205.ozazak.application.streak.port.in;

import com.b205.ozazak.application.streak.result.GetStreakResult;
import java.time.LocalDate;

public interface GetStreakUseCase {
    /**
     * 사용자의 스트릭 데이터 조회
     * @param accountId 사용자 ID
     * @param targetDate 기준 날짜 (null일 경우 올해 전체)
     * @return 스트릭 데이터 및 요약 정보
     */
    GetStreakResult getStreak(Long accountId, LocalDate targetDate);
}
