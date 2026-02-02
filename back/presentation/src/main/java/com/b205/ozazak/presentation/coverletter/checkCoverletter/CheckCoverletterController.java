package com.b205.ozazak.presentation.coverletter.checkCoverletter;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.coverletter.command.CheckCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.CheckCoverletterUseCase;
import com.b205.ozazak.application.coverletter.result.CheckCoverletterResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
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
public class CheckCoverletterController {

    private final CheckCoverletterUseCase checkCoverletterUseCase;

    @Operation(
        summary = "자소서 확인/생성",
        description = "특정 공고에 대한 자소서가 존재하는지 확인하고, 없으면 새로 생성합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping("/check")
    public ResponseEntity<CheckCoverletterResponse> checkCoverletter(
            @AuthenticationPrincipal CustomPrincipal principal,
            @RequestParam @NotNull Long recruitmentId
    ) {
        CheckCoverletterCommand command = CheckCoverletterCommand.builder()
                .accountId(principal.getAccountId())
                .recruitmentId(recruitmentId)
                .build();
        
        CheckCoverletterResult result = checkCoverletterUseCase.execute(command);
        return ResponseEntity.ok(CheckCoverletterResponse.from(result));
    }
}
