package com.b205.ozazak.presentation.community.controller;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.community.command.CreateCommunityCommand;
import com.b205.ozazak.application.community.port.in.CreateCommunityUseCase;
import com.b205.ozazak.application.community.port.in.GetCommunityUseCase;
import com.b205.ozazak.application.community.result.CreateCommunityResult;
import com.b205.ozazak.application.community.result.GetCommunityResult;
import com.b205.ozazak.presentation.common.response.ErrorResponse;
import com.b205.ozazak.presentation.community.dto.request.CreateCommunityRequest;
import com.b205.ozazak.presentation.community.dto.response.CommunityResponse;
import com.b205.ozazak.presentation.community.dto.response.CreateCommunityResponse;
import com.b205.ozazak.presentation.community.dto.request.UpdateCommunityRequest;
import com.b205.ozazak.presentation.community.dto.response.UpdateCommunityResponse;
import com.b205.ozazak.application.community.command.UpdateCommunityCommand;
import com.b205.ozazak.application.community.port.in.UpdateCommunityUseCase;
import com.b205.ozazak.application.community.result.UpdateCommunityResult;
import com.b205.ozazak.presentation.community.error.CommunityApiErrors;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Tag(name = "Community", description = "Community API")
public class CommunityController {

    private final GetCommunityUseCase getCommunityUseCase;
    private final CreateCommunityUseCase createCommunityUseCase;
    private final UpdateCommunityUseCase updateCommunityUseCase;

    @Operation(summary = "Get Community Detail")
    @GetMapping("/{communityId}")
    public ResponseEntity<CommunityResponse> getCommunity(@PathVariable Long communityId) {
        GetCommunityResult result = getCommunityUseCase.getCommunity(communityId);
        return ResponseEntity.ok(CommunityResponse.from(result));
    }

    @Operation(summary = "Create Community", description = CommunityApiErrors.PostCommunity.DESCRIPTION)
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Community created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = CommunityApiErrors.PostCommunity.BAD_REQUEST_VALIDATION, 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = CommunityApiErrors.PostCommunity.UNAUTHORIZED, 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = CommunityApiErrors.PostCommunity.FORBIDDEN, 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = CommunityApiErrors.PostCommunity.CONFLICT, 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<Map<String, CreateCommunityResponse>> createCommunity(
            @AuthenticationPrincipal CustomPrincipal principal,
            @Valid @RequestBody CreateCommunityRequest request
    ) {
        // Normalize tags: null → empty list (fail-fast at edge, not in domain)
        List<String> normalizedTags = request.tags() != null ? request.tags() : Collections.emptyList();
        
        // Map request DTO → application command
        CreateCommunityCommand command = new CreateCommunityCommand(
                principal.getAccountId(),
                request.communityCode(),
                request.title(),
                request.content(),
                normalizedTags
        );
        
        // Execute use case
        CreateCommunityResult result = createCommunityUseCase.create(command);
        
        // Map application result → response DTO with data envelope
        CreateCommunityResponse response = CreateCommunityResponse.from(result.communityId());
        return ResponseEntity.status(201).body(Map.of("data", response));
    }

    @Operation(summary = "Update Community", description = CommunityApiErrors.PutCommunity.DESCRIPTION)
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Community updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = CommunityApiErrors.PutCommunity.BAD_REQUEST_VALIDATION, 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = CommunityApiErrors.PutCommunity.UNAUTHORIZED, 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = CommunityApiErrors.PutCommunity.FORBIDDEN_AUTHOR, 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = CommunityApiErrors.PutCommunity.NOT_FOUND, 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{communityId}")
    public ResponseEntity<Map<String, UpdateCommunityResponse>> updateCommunity(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long communityId,
            @Valid @RequestBody UpdateCommunityRequest request
    ) {
        UpdateCommunityCommand command = UpdateCommunityCommand.builder()
                .accountId(principal.getAccountId())
                .communityId(communityId)
                .communityCode(request.communityCode())
                .title(request.title())
                .content(request.content())
                .tags(request.tags())
                .build();

        UpdateCommunityResult result = updateCommunityUseCase.update(command);
        
        return ResponseEntity.ok(Map.of("data", new UpdateCommunityResponse(result.getCommunityId())));
    }
}
