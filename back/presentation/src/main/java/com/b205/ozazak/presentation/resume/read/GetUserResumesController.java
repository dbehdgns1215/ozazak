package com.b205.ozazak.presentation.resume.read;

import com.b205.ozazak.application.resume.read.GetUserResumesResult;
import com.b205.ozazak.application.resume.service.GetUserResumesService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/records")
@RequiredArgsConstructor
public class GetUserResumesController {
    private final GetUserResumesService getUserResumesService;

    @GetMapping
    public ResponseEntity<ApiResponse<GetUserResumesResponse>> getUserResumes(
        @PathVariable Long userId
    ) {
        // Service 실행
        GetUserResumesResult result = getUserResumesService.getUserResumes(userId);

        // Result -> ResponseDTO 매핑
        List<ResumeResponseDto> resumeDtos = result.resumes().stream()
            .map(dto -> new ResumeResponseDto(
                dto.resumeId(),
                dto.title(),
                dto.content(),
                dto.startedAt(),
                dto.endedAt()
            ))
            .toList();

        GetUserResumesResponse response = new GetUserResumesResponse(
            result.userId(),
            resumeDtos
        );

        // ApiResponse 반환
        ApiResponse<GetUserResumesResponse> apiResponse = ApiResponse.<GetUserResumesResponse>builder()
            .message("사용자 이력 조회 성공")
            .data(response)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
