package com.b205.ozazak.presentation.block.updateBlock;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.block.command.UpdateBlockCommand;
import com.b205.ozazak.application.block.port.in.UpdateBlockUseCase;
import com.b205.ozazak.application.block.result.UpdateBlockResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blocks")
@RequiredArgsConstructor
@Tag(name = "Block", description = "블록 API")
public class UpdateBlockController {

    private final UpdateBlockUseCase updateBlockUseCase;

    @Operation(
        summary = "블록 수정",
        description = "기존 블록을 수정합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PutMapping("/{id}")
    public ResponseEntity<UpdateBlockResponse> updateBlock(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateBlockRequest request
    ) {
        UpdateBlockCommand command = UpdateBlockCommand.builder()
                .blockId(id)
                .accountId(principal.getAccountId())
                .title(request.getTitle())
                .content(request.getContent())
                .categories(request.getCategories())
                .build();

        UpdateBlockResult result = updateBlockUseCase.execute(command);

        return ResponseEntity.ok(UpdateBlockResponse.from(result));
    }
}
