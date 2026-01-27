package com.b205.ozazak.presentation.coverletter.controller;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.coverletter.port.in.GetCoverletterListUseCase;
import com.b205.ozazak.application.coverletter.port.in.GetCoverletterDetailUseCase;
import com.b205.ozazak.application.coverletter.result.CoverletterListResult;
import com.b205.ozazak.presentation.coverletter.dto.CoverletterListResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coverletters")
@RequiredArgsConstructor
@Tag(name = "Coverletter", description = "자소서 API")
public class CoverletterController {

    private final GetCoverletterListUseCase getCoverletterListUseCase;
    private final GetCoverletterDetailUseCase getCoverletterDetailUseCase;

    @Operation(
        summary = "자소서 전체 조회",
        description = "현재 로그인한 사용자의 자소서 목록을 페이지네이션으로 조회합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping
    public ResponseEntity<CoverletterListResponse> getCoverletterList(
            @AuthenticationPrincipal CustomPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var results = getCoverletterListUseCase.getCoverletterList(principal.getAccountId(), page, size);
        return ResponseEntity.ok(CoverletterListResponse.from(results));
    }

    @Operation(
        summary = "자소서 상세 조회",
        description = "자소서 상세 정보(문항 및 에세이 버전 포함)를 조회합니다. 본인의 자소서만 조회 가능합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping("/{id}")
    public ResponseEntity<com.b205.ozazak.presentation.coverletter.dto.CoverletterDetailResponse> getCoverletterDetail(
            @AuthenticationPrincipal CustomPrincipal principal,
            @org.springframework.web.bind.annotation.PathVariable Long id
    ) {
        var result = getCoverletterDetailUseCase.getCoverletterDetail(principal.getAccountId(), id);
        return ResponseEntity.ok(com.b205.ozazak.presentation.coverletter.dto.CoverletterDetailResponse.from(result));
    }
}
