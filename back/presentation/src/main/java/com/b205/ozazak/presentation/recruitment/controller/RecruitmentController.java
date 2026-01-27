package com.b205.ozazak.presentation.recruitment.controller;

import com.b205.ozazak.application.recruitment.port.in.GetRecruitmentDetailUseCase;
import com.b205.ozazak.application.recruitment.result.RecruitmentDetailResult;
import com.b205.ozazak.presentation.recruitment.dto.RecruitmentDetailResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recruitments")
@RequiredArgsConstructor
@Tag(name = "Recruitment", description = "채용공고 API")
public class RecruitmentController {

    private final GetRecruitmentDetailUseCase getRecruitmentDetailUseCase;

    @Operation(
        summary = "채용공고 상세 조회",
        description = "채용공고 상세 정보와 자소서 질문 목록을 조회합니다."
    )
    @GetMapping("/{id}")
    public ResponseEntity<RecruitmentDetailResponse> getRecruitmentDetail(
            @PathVariable Long id
    ) {
        RecruitmentDetailResult result = getRecruitmentDetailUseCase.getRecruitmentDetail(id);
        return ResponseEntity.ok(RecruitmentDetailResponse.from(result));
    }
}
