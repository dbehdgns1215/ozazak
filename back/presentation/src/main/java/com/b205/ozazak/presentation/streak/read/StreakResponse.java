package com.b205.ozazak.presentation.streak.read;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

public class StreakResponse {
    
    @Getter
    @Builder
    public static class StreakDataDto {
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate date;
        
        private Integer value;
    }
    
    @Getter
    @Builder
    public static class StreakDataSummary {
        private Integer currentStreak;
        private Integer longestStreak;
    }
}

