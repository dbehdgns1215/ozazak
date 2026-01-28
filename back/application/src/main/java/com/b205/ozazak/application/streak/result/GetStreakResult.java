package com.b205.ozazak.application.streak.result;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class GetStreakResult {
    // 일일 스트릭 기록 리스트
    private List<StreakData> streakDataList;
    
    // 스트릭 요약 정보
    private StreakSummary streakSummary;
    
    @Getter
    @Builder
    public static class StreakData {
        private LocalDate date;
        private Integer value;  // 활동 횟수
    }
    
    @Getter
    @Builder
    public static class StreakSummary {
        private Integer currentStreak;   // 현재 연속 스트릭 수
        private Integer longestStreak;   // 최장 연속 스트릭 수
    }
}
