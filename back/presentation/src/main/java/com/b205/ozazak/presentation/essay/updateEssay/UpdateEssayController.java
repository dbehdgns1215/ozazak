package com.b205.ozazak.presentation.essay.updateEssay;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.essay.command.UpdateEssayCommand;
import com.b205.ozazak.application.essay.port.in.UpdateEssayUseCase;
import com.b205.ozazak.application.essay.result.UpdateEssayResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/essays")
@RequiredArgsConstructor
@Tag(name = "Essay", description = "에세이 API")
public class UpdateEssayController {

    private final UpdateEssayUseCase updateEssayUseCase;

    @Operation(
        summary = "에세이 수정",
        description = "에세이 내용을 수정합니다. 버전 관리는 별도 API에서 처리합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PutMapping("/{id}")
    public ResponseEntity<UpdateEssayResponse> updateEssay(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id,
            @RequestBody @Valid UpdateEssayRequest request
    ) {
        // RequestDto → Command 변환
        UpdateEssayCommand command = UpdateEssayCommand.builder()
                .essayId(id)
                .accountId(principal.getAccountId())
                .content(request.getContent())
                .versionTitle(request.getVersionTitle())  // optional
                .build();
        
        UpdateEssayResult result = updateEssayUseCase.execute(command);
        
        return ResponseEntity.ok(UpdateEssayResponse.from(result));
    }
}
