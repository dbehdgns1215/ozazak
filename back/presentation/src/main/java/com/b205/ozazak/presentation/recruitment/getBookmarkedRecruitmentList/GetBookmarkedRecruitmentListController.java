package com.b205.ozazak.presentation.recruitment.getBookmarkedRecruitmentList;

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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recruitments/bookmark")
@RequiredArgsConstructor
@Tag(name = "Recruitment", description = "Recruitment API")
public class GetBookmarkedRecruitmentListController {

    private final GetRecruitmentUseCase getRecruitmentUseCase;

    @Operation(summary = "Get Bookmarked Recruitments", description = "내가 북마크한 공고 목록 조회")
    @GetMapping
    public ResponseEntity<List<GetRecruitmentListResponse>> getBookmarkedRecruitmentList(
            @AuthenticationPrincipal CustomPrincipal principal) {
        Long accountId = principal.getAccountId();

        List<GetRecruitmentListResult> results = getRecruitmentUseCase.getBookmarkedRecruitmentList(accountId);

        List<GetRecruitmentListResponse> response = results.stream()
                .map(GetRecruitmentListResponse::from)
                .toList();

        return ResponseEntity.ok(response);
    }
}
