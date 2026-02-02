package com.b205.ozazak.presentation.streak.controller;

import com.b205.ozazak.application.streak.dto.ExecuteBatchRequest;
import com.b205.ozazak.infra.streak.batch.StreakBatch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/streaks")
@RequiredArgsConstructor
@Tag(name = "Streak Admin", description = "Streak Management API")
@PreAuthorize("hasRole('ADMIN')")
public class StreakBatchAdminController {

    private final StreakBatch streakBatch;

    @Operation(summary = "[어드민] 배치 수동 실행 (특정 기준 날짜 기반)")
    @PostMapping("/batch/execute")
    public ResponseEntity<Void> executeBatchManually(@RequestBody(required = false) ExecuteBatchRequest request) {
        LocalDate baseDate = (request != null && request.getBaseDate() != null) 
            ? request.getBaseDate() 
            : LocalDate.now();
        streakBatch.executeManually(baseDate);
        return ResponseEntity.ok().build();
    }
}
