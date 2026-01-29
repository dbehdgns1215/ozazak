package com.b205.ozazak.presentation.essay.setCurrentEssay;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.essay.command.SetCurrentEssayCommand;
import com.b205.ozazak.application.essay.port.in.SetCurrentEssayUseCase;
import com.b205.ozazak.application.essay.result.SetCurrentEssayResult;
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
public class SetCurrentEssayController {

    private final SetCurrentEssayUseCase setCurrentEssayUseCase;

    @Operation(
        summary = "현재 버전 변경",
        description = "특정 에세이를 현재 버전으로 설정합니다. 이전 현재 버전은 자동으로 isCurrent=false가 됩니다. " +
                     "성능 최적화를 위해 previousCurrentEssayId를 함께 보내주세요 (최대 2개 essay만 업데이트).",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PutMapping("/{id}/current")
    public ResponseEntity<SetCurrentEssayResponse> setCurrentEssay(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id,
            @RequestBody @Valid SetCurrentEssayRequest request
    ) {
        // RequestDto + Path → Command 변환
        SetCurrentEssayCommand command = SetCurrentEssayCommand.builder()
                .targetEssayId(id)
                .previousCurrentEssayId(request.getPreviousCurrentEssayId())
                .accountId(principal.getAccountId())
                .build();
        
        SetCurrentEssayResult result = setCurrentEssayUseCase.execute(command);
        
        return ResponseEntity.ok(SetCurrentEssayResponse.from(result));
    }
}
