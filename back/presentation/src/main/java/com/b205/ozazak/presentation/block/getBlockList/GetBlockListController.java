package com.b205.ozazak.presentation.block.getBlockList;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.block.command.GetBlockListCommand;
import com.b205.ozazak.application.block.port.in.GetBlockListUseCase;
import com.b205.ozazak.application.block.result.BlockListResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
public class GetBlockListController {

    private final GetBlockListUseCase getBlockListUseCase;

    @Operation(
        summary = "블록 목록 조회",
        description = "로그인한 사용자의 블록 목록을 조회합니다. 카테고리 및 키워드로 필터링 가능합니다.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping
    public ResponseEntity<GetBlockListResponse> getBlockList(
            @AuthenticationPrincipal CustomPrincipal principal,
            @Parameter(description = "카테고리 코드 (0~14)") @RequestParam(required = false) Integer category,
            @Parameter(description = "검색 키워드") @RequestParam(required = false) String keyword,
            @Parameter(description = "페이지 번호 (0부터 시작)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기") @RequestParam(defaultValue = "10") int size
    ) {
        GetBlockListCommand command = GetBlockListCommand.builder()
                .accountId(principal.getAccountId())
                .category(category)
                .keyword(keyword)
                .page(page)
                .size(size)
                .build();

        BlockListResult result = getBlockListUseCase.execute(command);

        return ResponseEntity.ok(GetBlockListResponse.from(result));
    }
}
