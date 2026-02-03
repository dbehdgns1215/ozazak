package com.b205.ozazak.presentation.coverletter.updateCoverletter;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.coverletter.command.UpdateCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.UpdateCoverletterUseCase;
import com.b205.ozazak.application.coverletter.result.UpdateCoverletterResult;
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
@RequestMapping("/api/coverletters")
@RequiredArgsConstructor
@Tag(name = "Coverletter", description = "자기소개서 API")
public class UpdateCoverletterController {

        private final UpdateCoverletterUseCase updateCoverletterUseCase;

        @Operation(summary = "자소서 전체 수정", description = "자소서 메타데이터(title, isComplete, isPassed)와 여러 에세이 내용을 한 번에 수정합니다. 버전 생성 없이 내용만 업데이트됩니다.", security = @SecurityRequirement(name = "Bearer Authentication"))
        @PutMapping("/{id}")
        public ResponseEntity<UpdateCoverletterResponse> updateCoverletter(
                        @AuthenticationPrincipal CustomPrincipal principal,
                        @PathVariable Long id,
                        @RequestBody @Valid UpdateCoverletterRequest request) {
                // RequestDto → Command 변환
                UpdateCoverletterCommand command = UpdateCoverletterCommand.builder()
                                .coverletterId(id)
                                .accountId(principal.getAccountId())
                                .title(request.getTitle())
                                .isComplete(request.getIsComplete())
                                .isPassed(request.getIsPassed())
                                .essays(request.getEssays().stream()
                                                .map(e -> UpdateCoverletterCommand.EssayUpdateData.builder()
                                                                .essayId(e.getId())
                                                                .content(e.getContent())
                                                                .build())
                                                .collect(Collectors.toList()))
                                .build();

                UpdateCoverletterResult result = updateCoverletterUseCase.execute(command);

                return ResponseEntity.ok(UpdateCoverletterResponse.from(result));
        }
}
