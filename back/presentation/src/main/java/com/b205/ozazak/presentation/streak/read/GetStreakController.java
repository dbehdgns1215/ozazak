package com.b205.ozazak.presentation.streak.read;

import com.b205.ozazak.application.streak.port.in.GetStreakUseCase;
import com.b205.ozazak.application.streak.result.GetStreakResult;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/{userId}/streak")
@RequiredArgsConstructor
@Tag(name = "Streak", description = "Streak Retrieval API")
public class GetStreakController {

    private final GetStreakUseCase getStreakUseCase;

    @Operation(summary = "사용자 스트릭 조회")
    @GetMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<ApiResponse<?>> getStreak(
            @PathVariable Long userId,
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate date) {
        
        GetStreakResult result = getStreakUseCase.getStreak(userId, date);
        
        // data는 List를 직접 사용
        List<StreakResponse.StreakDataDto> dataList = result.getStreakDataList().stream()
                .map(d -> StreakResponse.StreakDataDto.builder()
                        .date(d.getDate())
                        .value(d.getValue())
                        .build())
                .toList();
        
        // extras에 streakData 추가
        Map<String, Object> extras = new HashMap<>();
        extras.put("streakData", StreakResponse.StreakDataSummary.builder()
                .currentStreak(result.getStreakSummary().getCurrentStreak())
                .longestStreak(result.getStreakSummary().getLongestStreak())
                .build());
        
        ApiResponse<?> response = ApiResponse.success("스트릭 조회 성공", dataList, extras);
        return ResponseEntity.ok(response);
    }
}

