package com.b205.ozazak.presentation.recruitment.getClosingRecruitmentList;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.recruitment.port.in.GetRecruitmentUseCase;
import com.b205.ozazak.application.recruitment.result.GetRecruitmentListResult;
import com.b205.ozazak.presentation.recruitment.getRecruitmentList.GetRecruitmentListResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recruitments/closing")
@RequiredArgsConstructor
@Tag(name = "Recruitment", description = "Recruitment API")
public class GetClosingRecruitmentListController {

    private final GetRecruitmentUseCase getRecruitmentUseCase;

    @Operation(summary = "Get Closing Soon Recruitments", description = "마감 임박 공고 조회 (기본값: D-5, 마감일 순 정렬)")
    @GetMapping
    public ResponseEntity<List<GetRecruitmentListResponse>> getClosingRecruitmentList(
            @RequestParam(name = "days", required = false) Integer days,
            @AuthenticationPrincipal CustomPrincipal principal) {
        Long accountId = principal != null ? principal.getAccountId() : null;

        List<GetRecruitmentListResult> results = getRecruitmentUseCase.getClosingRecruitmentList(accountId, days);

        List<GetRecruitmentListResponse> response = results.stream()
                .map(GetRecruitmentListResponse::from)
                .toList();

        return ResponseEntity.ok(response);
    }
}
