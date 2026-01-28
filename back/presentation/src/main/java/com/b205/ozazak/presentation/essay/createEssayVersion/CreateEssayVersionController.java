package com.b205.ozazak.presentation.essay.createEssayVersion;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.essay.command.CreateEssayVersionCommand;
import com.b205.ozazak.application.essay.port.in.CreateEssayVersionUseCase;
import com.b205.ozazak.application.essay.result.CreateEssayVersionResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/essays")
@RequiredArgsConstructor
@Tag(name = "Essay", description = "에세이 API")
public class CreateEssayVersionController {

    private final CreateEssayVersionUseCase createEssayVersionUseCase;

    @Operation(
        summary = "에세이 새 버전 생성",
        description = "기존 에세이를 기반으로 새 버전을 생성합니다. 버전 번호는 같은 Question의 최대 버전 + 1로 자동 부여됩니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/{id}/versions")
    public ResponseEntity<CreateEssayVersionResponse> createVersion(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id,
            @RequestBody @Valid CreateEssayVersionRequest request
    ) {
        // RequestDto → Command 변환
        CreateEssayVersionCommand command = CreateEssayVersionCommand.builder()
                .baseEssayId(id)
                .accountId(principal.getAccountId())
                .content(request.getContent())
                .versionTitle(request.getVersionTitle())
                .build();
        
        CreateEssayVersionResult result = createEssayVersionUseCase.execute(command);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CreateEssayVersionResponse.from(result));
    }
}
