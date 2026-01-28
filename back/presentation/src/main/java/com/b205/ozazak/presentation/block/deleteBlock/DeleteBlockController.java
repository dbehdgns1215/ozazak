package com.b205.ozazak.presentation.block.deleteBlock;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.block.command.DeleteBlockCommand;
import com.b205.ozazak.application.block.port.in.DeleteBlockUseCase;
import com.b205.ozazak.application.block.result.DeleteBlockResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blocks")
@RequiredArgsConstructor
@Tag(name = "Block", description = "블록 API")
public class DeleteBlockController {

    private final DeleteBlockUseCase deleteBlockUseCase;

    @Operation(
        summary = "블록 삭제",
        description = "블록을 soft delete합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteBlockResponse> deleteBlock(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id
    ) {
        DeleteBlockCommand command = DeleteBlockCommand.builder()
                .blockId(id)
                .accountId(principal.getAccountId())
                .build();

        DeleteBlockResult result = deleteBlockUseCase.execute(command);

        return ResponseEntity.ok(DeleteBlockResponse.from(result));
    }
}
