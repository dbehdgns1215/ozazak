package com.b205.ozazak.presentation.activity.update;

import com.b205.ozazak.application.activity.command.UpdateAwardCommand;
import com.b205.ozazak.application.activity.result.UpdateAwardResult;
import com.b205.ozazak.application.activity.service.UpdateAwardService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/awards/{awardId}")
@RequiredArgsConstructor
@Tag(name = "Award", description = "Award Management API")
public class UpdateAwardController {

    private final UpdateAwardService updateAwardService;

    @Operation(summary = "Update an award")
    @PutMapping
    public ResponseEntity<ApiResponse<UpdateAwardResponse>> updateAward(
            @PathVariable Long userId,
            @PathVariable Long awardId,
            @Valid @RequestBody UpdateAwardRequest request) {
        
        UpdateAwardCommand command = new UpdateAwardCommand(
                userId,
                awardId,
                request.title(),
                request.rankName(),
                request.organization(),
                request.awardedAt()
        );

        UpdateAwardResult result = updateAwardService.execute(command);
        UpdateAwardResponse response = new UpdateAwardResponse(result.userId());

        return ResponseEntity.ok(ApiResponse.success("수상 수정 성공", response));
    }
}
