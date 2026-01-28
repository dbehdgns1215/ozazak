package com.b205.ozazak.presentation.resume.update;

import com.b205.ozazak.application.resume.service.UpdateResumeService;
import com.b205.ozazak.application.resume.update.UpdateResumeCommand;
import com.b205.ozazak.application.resume.update.UpdateResumeResult;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/records/{recordId}")
@RequiredArgsConstructor
public class UpdateResumeController {
    private final UpdateResumeService updateResumeService;

    @PutMapping
    public ResponseEntity<ApiResponse<UpdateResumeResponse>> updateResume(
        @PathVariable Long userId,
        @PathVariable Long recordId,
        @Valid @RequestBody UpdateResumeRequest request
    ) {
        // RequestDTO -> Command 매핑
        UpdateResumeCommand command = new UpdateResumeCommand(
            userId,
            recordId,
            request.title(),
            request.content(),
            request.startedAt(),
            request.endedAt()
        );

        // Service 실행
        UpdateResumeResult result = updateResumeService.updateResume(command);

        // Result -> ResponseDTO 매핑
        UpdateResumeResponse response = new UpdateResumeResponse(result.userId());

        // ApiResponse 반환
        ApiResponse<UpdateResumeResponse> apiResponse = ApiResponse.<UpdateResumeResponse>builder()
            .message("이력 수정 성공")
            .data(response)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
