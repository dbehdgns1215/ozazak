package com.b205.ozazak.presentation.essay.aiGenerate;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.essay.command.AIGenerateEssayBatchCommand;
import com.b205.ozazak.application.essay.port.in.AIGenerateEssayBatchUseCase;
import com.b205.ozazak.application.essay.result.AIGenerateEssayBatchResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/essays")
@RequiredArgsConstructor
@Tag(name = "Essay AI", description = "AI 자소서 생성 API")
public class AIGenerateEssayController {

    private final AIGenerateEssayBatchUseCase aiGenerateEssayBatchUseCase;

    @Operation(
            summary = "AI 자소서 일괄 생성",
            description = "여러 문항에 대해 AI로 자소서를 생성합니다. 참조 자소서와 블록을 기반으로 생성하며, " +
                    "기존 내용이 없으면 덮어씌우고, 있으면 새 버전을 생성합니다.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/ai")
    public ResponseEntity<AIGenerateEssayResponse> generateAI(
            @AuthenticationPrincipal CustomPrincipal principal,
            @Valid @RequestBody AIGenerateEssayRequest request
    ) {
        AIGenerateEssayBatchCommand command = AIGenerateEssayBatchCommand.builder()
                .accountId(principal.getAccountId())
                .recruitmentId(request.getRecruitmentId())
                .referenceCoverletterIds(request.getReferenceCoverletters())
                .essays(request.getEssays().stream()
                        .map(item -> AIGenerateEssayBatchCommand.EssayGenerationItem.builder()
                                .essayId(item.getEssayId())
                                .referenceBlockIds(item.getReferenceBlocks())
                                .essayContent(item.getEssayContent())
                                .userPrompt(item.getUserPrompt())
                                .build())
                        .collect(Collectors.toList()))
                .build();

        AIGenerateEssayBatchResult result = aiGenerateEssayBatchUseCase.execute(command);

        return ResponseEntity.ok(AIGenerateEssayResponse.from(result));
    }
}
