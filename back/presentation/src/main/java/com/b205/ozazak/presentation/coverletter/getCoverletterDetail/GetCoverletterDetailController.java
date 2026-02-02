package com.b205.ozazak.presentation.coverletter.getCoverletterDetail;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.coverletter.command.GetCoverletterDetailCommand;
import com.b205.ozazak.application.coverletter.port.in.GetCoverletterDetailUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coverletters")
@RequiredArgsConstructor
@Tag(name = "Coverletter", description = "자소서 API")
public class GetCoverletterDetailController {

    private final GetCoverletterDetailUseCase getCoverletterDetailUseCase;

    @Operation(
        summary = "자소서 상세 조회",
        description = "자소서 상세 정보(문항 및 에세이 버전 포함)를 조회합니다. 본인의 자소서만 조회 가능합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping("/{id}")
    public ResponseEntity<GetCoverletterDetailResponse> getCoverletterDetail(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id
    ) {
        GetCoverletterDetailCommand command = GetCoverletterDetailCommand.builder()
                .accountId(principal.getAccountId())
                .coverletterId(id)
                .build();
        
        var result = getCoverletterDetailUseCase.execute(command);
        return ResponseEntity.ok(GetCoverletterDetailResponse.from(result));
    }
}
