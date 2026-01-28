package com.b205.ozazak.presentation.coverletter.deleteCoverletter;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.coverletter.command.DeleteCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.DeleteCoverletterUseCase;
import com.b205.ozazak.application.coverletter.result.DeleteCoverletterResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coverletters")
@RequiredArgsConstructor
@Tag(name = "Coverletter", description = "자소서 API")
public class DeleteCoverletterController {

    private final DeleteCoverletterUseCase deleteCoverletterUseCase;

    @Operation(
        summary = "자소서 삭제",
        description = "자소서를 soft delete하고 관련된 모든 에세이를 batch hard delete합니다. " +
                     "삭제된 자소서 ID와 함께 삭제된 에세이 개수를 반환합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteCoverletterResponse> deleteCoverletter(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id
    ) {
        DeleteCoverletterCommand command = DeleteCoverletterCommand.builder()
                .coverletterId(id)
                .accountId(principal.getAccountId())
                .build();
        
        DeleteCoverletterResult result = deleteCoverletterUseCase.execute(command);
        
        return ResponseEntity.ok(DeleteCoverletterResponse.from(result));
    }
}
