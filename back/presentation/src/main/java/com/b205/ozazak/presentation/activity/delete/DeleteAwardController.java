package com.b205.ozazak.presentation.activity.delete;

import com.b205.ozazak.application.activity.command.DeleteAwardCommand;
import com.b205.ozazak.application.activity.result.DeleteAwardResult;
import com.b205.ozazak.application.activity.service.DeleteAwardService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/awards/{awardId}")
@RequiredArgsConstructor
@Tag(name = "Award", description = "Award Management API")
public class DeleteAwardController {

    private final DeleteAwardService deleteAwardService;

    @Operation(summary = "Delete an award")
    @DeleteMapping
    public ResponseEntity<ApiResponse<DeleteAwardResponse>> deleteAward(
            @PathVariable Long userId,
            @PathVariable Long awardId) {
        
        DeleteAwardCommand command = new DeleteAwardCommand(userId, awardId);
        DeleteAwardResult result = deleteAwardService.execute(command);
        DeleteAwardResponse response = new DeleteAwardResponse(result.userId());

        return ResponseEntity.ok(ApiResponse.success("수상 삭제 성공", response));
    }
}
