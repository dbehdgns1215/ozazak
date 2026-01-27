package com.b205.ozazak.presentation.recruitment.getRecruitmentList;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.recruitment.port.in.GetRecruitmentUseCase;
import com.b205.ozazak.application.recruitment.result.GetRecruitmentListResult;
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
@RequestMapping("/api/recruitments")
@RequiredArgsConstructor
@Tag(name = "Recruitment", description = "Recruitment API")
public class GetRecruitmentListController {

    private final GetRecruitmentUseCase getRecruitmentUseCase;

    @Operation(summary = "Get Recruitment List", description = "공고 목록 조회 (월 단위 필터링)")
    @GetMapping
    public ResponseEntity<List<GetRecruitmentListResponse>> getRecruitmentList(
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "month", required = false) Integer month,
            @AuthenticationPrincipal CustomPrincipal principal) {
        Long accountId = principal != null ? principal.getAccountId() : null;

        List<GetRecruitmentListResult> results = getRecruitmentUseCase.getRecruitmentList(accountId, year, month);

        List<GetRecruitmentListResponse> response = results.stream()
                .map(GetRecruitmentListResponse::from)
                .toList();

        return ResponseEntity.ok(response);
    }
}
