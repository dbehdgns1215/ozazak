package com.b205.ozazak.presentation.resume.create;

import com.b205.ozazak.application.resume.service.CreateResumeService;
import com.b205.ozazak.application.resume.command.CreateResumeCommand;
import com.b205.ozazak.application.resume.result.CreateResumeResult;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/records")
@RequiredArgsConstructor
public class CreateResumeController {
    private final CreateResumeService createResumeService;

    @PostMapping
    public ResponseEntity<ApiResponse<CreateResumeResponse>> createResume(
        @PathVariable Long userId,
        @Valid @RequestBody CreateResumeRequest request
    ) {
        // RequestDTO -> Command 매핑
        CreateResumeCommand command = new CreateResumeCommand(
            userId,
            request.title(),
            request.content(),
            request.startedAt(),
            request.endedAt()
        );

        // Service 실행
        CreateResumeResult result = createResumeService.createResume(command);

        // Result -> ResponseDTO 매핑
        CreateResumeResponse response = new CreateResumeResponse(result.userId());

        // ApiResponse 반환
        ApiResponse<CreateResumeResponse> apiResponse = ApiResponse.<CreateResumeResponse>builder()
            .message("이력 생성 성공")
            .data(response)
            .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
}
