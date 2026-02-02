package com.b205.ozazak.presentation.activity.create;

import com.b205.ozazak.application.activity.command.CreateAwardCommand;
import com.b205.ozazak.application.activity.result.CreateAwardResult;
import com.b205.ozazak.application.activity.service.CreateAwardService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/awards")
@RequiredArgsConstructor
@Tag(name = "Award", description = "Award Management API")
public class CreateAwardController {

    private final CreateAwardService createAwardService;

    @Operation(summary = "Create a new award")
    @PostMapping
    public ResponseEntity<ApiResponse<CreateAwardResponse>> createAward(
            @PathVariable Long userId,
            @Valid @RequestBody CreateAwardRequest request) {
        
        CreateAwardCommand command = new CreateAwardCommand(
                userId,
                request.title(),
                request.rankName(),
                request.organization(),
                request.awardedAt()
        );

        CreateAwardResult result = createAwardService.execute(command);
        CreateAwardResponse response = new CreateAwardResponse(result.userId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("수상 등록 성공", response));
    }
}
