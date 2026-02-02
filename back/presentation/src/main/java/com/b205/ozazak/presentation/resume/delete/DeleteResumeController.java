package com.b205.ozazak.presentation.resume.delete;

import com.b205.ozazak.application.resume.service.DeleteResumeService;
import com.b205.ozazak.application.resume.delete.DeleteResumeCommand;
import com.b205.ozazak.application.resume.delete.DeleteResumeResult;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/records/{recordId}")
@RequiredArgsConstructor
public class DeleteResumeController {
    private final DeleteResumeService deleteResumeService;

    @DeleteMapping
    public ResponseEntity<ApiResponse<DeleteResumeResponse>> deleteResume(
        @PathVariable Long userId,
        @PathVariable Long recordId
    ) {
        // Command 생성
        DeleteResumeCommand command = new DeleteResumeCommand(userId, recordId);

        // Service 실행
        DeleteResumeResult result = deleteResumeService.deleteResume(command);

        // Result → ResponseDTO 매핑
        DeleteResumeResponse response = new DeleteResumeResponse(result.userId());

        // ApiResponse 반환
        ApiResponse<DeleteResumeResponse> apiResponse = ApiResponse.<DeleteResumeResponse>builder()
            .message("이력 삭제 성공")
            .data(response)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
