package com.b205.ozazak.presentation.coverletter.createCoverletter;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.coverletter.command.CreateCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.CreateCoverletterUseCase;
import com.b205.ozazak.application.coverletter.result.CreateCoverletterResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coverletters")
@RequiredArgsConstructor
@Tag(name = "Coverletter", description = "자소서 API")
public class CreateCoverletterController {

    private final CreateCoverletterUseCase createCoverletterUseCase;

    @Operation(
        summary = "자소서 생성",
        description = "새로운 자소서와 에세이들을 생성합니다. 사용자가 입력한 질문들은 새로운 Question으로 저장됩니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping
    public ResponseEntity<CreateCoverletterResponse> createCoverletter(
            @AuthenticationPrincipal CustomPrincipal principal,
            @RequestBody @Valid CreateCoverletterRequest request
    ) {
        // RequestDto → Command 변환
        CreateCoverletterCommand command = CreateCoverletterCommand.builder()
                .accountId(principal.getAccountId())
                .recruitmentId(request.getRecruitmentId())
                .title(request.getTitle())
                .essays(request.getEssays().stream()
                        .map(e -> CreateCoverletterCommand.EssayData.builder()
                                .questionContent(e.getQuestion())
                                .essayContent(e.getContent())
                                .charMax(e.getCharMax())
                                .build())
                        .collect(Collectors.toList()))
                .build();
        
        CreateCoverletterResult result = createCoverletterUseCase.execute(command);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(CreateCoverletterResponse.from(result));
    }
}
