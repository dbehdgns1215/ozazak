package com.b205.ozazak.presentation.community.controller;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.community.command.CreateCommunityCommand;
import com.b205.ozazak.application.community.port.in.CreateCommunityUseCase;
import com.b205.ozazak.application.community.result.CreateCommunityResult;
import com.b205.ozazak.presentation.community.dto.request.CreateCommunityRequest;
import com.b205.ozazak.presentation.community.dto.response.CreateCommunityResponse;
import com.b205.ozazak.presentation.community.error.CommunityApiErrors;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Tag(name = "Community", description = "Community API")
public class CommunityWriteController {

    private final CreateCommunityUseCase createCommunityUseCase;

    @Operation(summary = "Create Community", description = CommunityApiErrors.PostCommunity.DESCRIPTION)
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Community created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bad Request (Validation/Business Rules)", 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.b205.ozazak.presentation.common.GlobalExceptionHandler.ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized", 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.b205.ozazak.presentation.common.GlobalExceptionHandler.ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Conflict (Integrity Violation)", 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.b205.ozazak.presentation.common.GlobalExceptionHandler.ErrorResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal Server Error", 
            content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.b205.ozazak.presentation.common.GlobalExceptionHandler.ErrorResponse.class)))
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
}
