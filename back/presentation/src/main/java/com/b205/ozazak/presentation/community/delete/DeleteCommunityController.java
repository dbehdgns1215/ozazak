package com.b205.ozazak.presentation.community.delete;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.community.command.DeleteCommunityCommand;
import com.b205.ozazak.application.community.port.in.DeleteCommunityUseCase;
import com.b205.ozazak.application.community.result.DeleteCommunityResult;
import com.b205.ozazak.presentation.common.response.ErrorResponse;
import com.b205.ozazak.presentation.community.error.CommunityApiErrors;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Tag(name = "Community", description = "Community API")
public class DeleteCommunityController {

    private final DeleteCommunityUseCase deleteCommunityUseCase;

    @Operation(summary = "Delete Community", description = CommunityApiErrors.DeleteCommunity.DESCRIPTION)
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Community deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = CommunityApiErrors.DeleteCommunity.UNAUTHORIZED,
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class)
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = CommunityApiErrors.DeleteCommunity.FORBIDDEN_AUTHOR,
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class)
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = CommunityApiErrors.DeleteCommunity.NOT_FOUND,
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class)
            )
        )
    })
    @DeleteMapping("/{communityId}")
    public ResponseEntity<Map<String, DeleteCommunityResponse>> deleteCommunity(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long communityId
    ) {
        boolean isAdmin = "ROLE_ADMIN".equals(principal.getRole());
        
        DeleteCommunityCommand command = new DeleteCommunityCommand(
                communityId,
                principal.getAccountId(),
                isAdmin
            );

        DeleteCommunityResult result = deleteCommunityUseCase.delete(command);
        
        return ResponseEntity.ok(Map.of("data", new DeleteCommunityResponse(result.getCommunityId())));
    }
}
