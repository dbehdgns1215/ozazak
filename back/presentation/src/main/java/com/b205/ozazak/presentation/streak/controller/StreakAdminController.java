package com.b205.ozazak.presentation.streak.controller;

import com.b205.ozazak.application.streak.dto.AdminUpdateActivityRequest;
import com.b205.ozazak.application.streak.port.in.StreakAdminUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/streaks")
@RequiredArgsConstructor
@Tag(name = "Streak Admin", description = "Streak Management API")
@PreAuthorize("hasRole('ADMIN')")
public class StreakAdminController {

    private final StreakAdminUseCase streakAdminUseCase;

    @Operation(summary = "[어드민] 특정 사용자의 활동 수 수정")
    @PostMapping("/activities/update")
    public ResponseEntity<Void> updateActivityCount(@Valid @RequestBody AdminUpdateActivityRequest request) {
        streakAdminUseCase.updateActivityCount(
                request.getAccountId(),
                request.getActivityDate(),
                request.getAmount()
        );
        return ResponseEntity.ok().build();
    }
}
