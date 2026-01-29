package com.b205.ozazak.presentation.recruitment.getRecruitment;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.recruitment.port.in.GetRecruitmentUseCase;
import com.b205.ozazak.application.recruitment.result.GetRecruitmentResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b205.ozazak.application.recruitment.command.GetRecruitmentCommand;

@RestController
@RequestMapping("/api/recruitments")
@RequiredArgsConstructor
@Tag(name = "Recruitment", description = "Recruitment API")
public class GetRecruitmentController {

    private final GetRecruitmentUseCase getRecruitmentUseCase;

    @Operation(summary = "Get Recruitment Detail", description = "공고 상세 조회")
    @GetMapping("/{recruitmentId}")
    public ResponseEntity<GetRecruitmentResponse> getRecruitment(
            @PathVariable(name = "recruitmentId") Long recruitmentId,
            @AuthenticationPrincipal CustomPrincipal principal) {
        Long accountId = principal != null ? principal.getAccountId() : null;

        GetRecruitmentResult result = getRecruitmentUseCase.getRecruitment(
                GetRecruitmentCommand.builder()
                        .recruitmentId(recruitmentId)
                        .accountId(accountId)
                        .build());

        return ResponseEntity.ok(GetRecruitmentResponse.from(result));
    }
}
