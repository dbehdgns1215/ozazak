package com.b205.ozazak.presentation.block.generateBlocks;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.block.command.GenerateBlocksFromProjectCommand;
import com.b205.ozazak.application.block.command.GenerateBlocksFromCommunityCommand;
import com.b205.ozazak.application.block.port.in.GenerateBlocksFromProjectUseCase;
import com.b205.ozazak.application.block.port.in.GenerateBlocksFromCommunityUseCase;
import com.b205.ozazak.application.block.result.GenerateBlocksResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Block", description = "블록 API")
@RestController
@RequestMapping("/api/blocks")
@RequiredArgsConstructor
public class GenerateBlocksController {

    private final GenerateBlocksFromProjectUseCase generateBlocksFromProjectUseCase;
    private final GenerateBlocksFromCommunityUseCase generateBlocksFromCommunityUseCase;

    @Operation(
        summary = "프로젝트에서 블록 생성", 
        description = "프로젝트 내용을 분석하여 경험 블록을 자동 생성합니다",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/generate/project")
    public ResponseEntity<GenerateBlocksResponse> generateFromProject(
            @AuthenticationPrincipal CustomPrincipal principal,
            @RequestBody GenerateBlocksFromProjectRequest request
    ) {
        GenerateBlocksFromProjectCommand command = GenerateBlocksFromProjectCommand.builder()
                .accountId(principal.getAccountId())
                .projectId(request.getProjectId())
                .build();

        GenerateBlocksResult result = generateBlocksFromProjectUseCase.execute(command);

        return ResponseEntity.ok(GenerateBlocksResponse.from(result.getBlocks()));
    }

    @Operation(
        summary = "TIL에서 블록 생성", 
        description = "TIL 내용을 분석하여 경험 블록을 자동 생성합니다",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/generate/til")
    public ResponseEntity<GenerateBlocksResponse> generateFromCommunity(
            @AuthenticationPrincipal CustomPrincipal principal,
            @RequestBody GenerateBlocksFromCommunityRequest request
    ) {
        GenerateBlocksFromCommunityCommand command = GenerateBlocksFromCommunityCommand.builder()
                .accountId(principal.getAccountId())
                .communityId(request.getCommunityId())
                .build();

        GenerateBlocksResult result = generateBlocksFromCommunityUseCase.execute(command);

        return ResponseEntity.ok(GenerateBlocksResponse.from(result.getBlocks()));
    }
}
