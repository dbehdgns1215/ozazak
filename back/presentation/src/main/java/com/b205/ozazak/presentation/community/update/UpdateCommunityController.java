package com.b205.ozazak.presentation.community.update;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.community.command.UpdateCommunityCommand;
import com.b205.ozazak.application.community.port.in.UpdateCommunityUseCase;
import com.b205.ozazak.application.community.result.UpdateCommunityResult;
import com.b205.ozazak.presentation.common.response.ErrorResponse;
import com.b205.ozazak.presentation.community.error.CommunityApiErrors;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Tag(name = "Community", description = "Community API")
public class UpdateCommunityController {

    private final UpdateCommunityUseCase updateCommunityUseCase;

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
