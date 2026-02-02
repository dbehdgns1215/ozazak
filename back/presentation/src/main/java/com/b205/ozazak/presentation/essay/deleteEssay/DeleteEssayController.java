package com.b205.ozazak.presentation.essay.deleteEssay;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.essay.command.DeleteEssayCommand;
import com.b205.ozazak.application.essay.port.in.DeleteEssayUseCase;
import com.b205.ozazak.application.essay.result.DeleteEssayResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/essays")
@RequiredArgsConstructor
@Tag(name = "Essay", description = "에세이 API")
public class DeleteEssayController {

    private final DeleteEssayUseCase deleteEssayUseCase;

    @Operation(
        summary = "에세이 삭제",
        description = "에세이를 완전히 삭제합니다 (복구 불가). 삭제한 essay가 isCurrent였다면 남은 버전 중 최신 버전이 자동으로 isCurrent가 됩니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteEssayResponse> deleteEssay(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id
    ) {
        // Path parameter → Command 변환
        DeleteEssayCommand command = DeleteEssayCommand.builder()
                .essayId(id)
                .accountId(principal.getAccountId())
                .build();
        
        DeleteEssayResult result = deleteEssayUseCase.execute(command);
        
        return ResponseEntity.ok(DeleteEssayResponse.from(result));
    }
}
