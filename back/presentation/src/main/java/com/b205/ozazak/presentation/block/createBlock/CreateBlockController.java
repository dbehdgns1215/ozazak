package com.b205.ozazak.presentation.block.createBlock;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.block.command.CreateBlockCommand;
import com.b205.ozazak.application.block.port.in.CreateBlockUseCase;
import com.b205.ozazak.application.block.result.CreateBlockResult;
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
@RequestMapping("/api/blocks")
@RequiredArgsConstructor
@Tag(name = "Block", description = "블록 API")
public class CreateBlockController {

    private final CreateBlockUseCase createBlockUseCase;

    @Operation(
        summary = "블록 생성",
        description = "새로운 블록을 생성합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping
    public ResponseEntity<CreateBlockResponse> createBlock(
            @AuthenticationPrincipal CustomPrincipal principal,
            @Valid @RequestBody CreateBlockRequest request
    ) {
        CreateBlockCommand command = CreateBlockCommand.builder()
                .accountId(principal.getAccountId())
                .title(request.getTitle())
                .content(request.getContent())
                .categories(request.getCategories())
                .build();

        CreateBlockResult result = createBlockUseCase.execute(command);

        return ResponseEntity.status(HttpStatus.CREATED).body(CreateBlockResponse.from(result));
    }
}
