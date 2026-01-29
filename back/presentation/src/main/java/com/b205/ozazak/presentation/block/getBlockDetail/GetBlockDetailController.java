package com.b205.ozazak.presentation.block.getBlockDetail;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.block.command.GetBlockDetailCommand;
import com.b205.ozazak.application.block.port.in.GetBlockDetailUseCase;
import com.b205.ozazak.application.block.result.BlockDetailResult;
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
public class GetBlockDetailController {

    private final GetBlockDetailUseCase getBlockDetailUseCase;

    @Operation(
        summary = "블록 상세 조회",
        description = "특정 블록의 상세 정보를 조회합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping("/{id}")
    public ResponseEntity<GetBlockDetailResponse> getBlockDetail(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long id
    ) {
        GetBlockDetailCommand command = GetBlockDetailCommand.builder()
                .blockId(id)
                .accountId(principal.getAccountId())
                .build();

        BlockDetailResult result = getBlockDetailUseCase.execute(command);

        return ResponseEntity.ok(GetBlockDetailResponse.from(result));
    }
}
