package com.b205.ozazak.presentation.community.til;

import com.b205.ozazak.application.community.command.ListTilCommand;
import com.b205.ozazak.application.community.port.in.ListTilUseCase;
import com.b205.ozazak.application.community.result.ListTilResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Controller for listing TIL posts
 */
@RestController
@RequestMapping("/api")
@Tag(name = "Community", description = "Community API")
@RequiredArgsConstructor
public class ListTilController {
    
    private final ListTilUseCase listTilUseCase;
    
    @GetMapping("/til")
    @Operation(summary = "Get TIL List", description = "Get paginated list of TIL posts with filters")
    public ResponseEntity<Map<String, Object>> listTil(
        @ModelAttribute @Valid ListTilRequest request,
        @AuthenticationPrincipal com.b205.ozazak.application.auth.model.CustomPrincipal principal
    ) {
        // Validate authorStatus if provided
        if (request.authorStatus() != null &&
            !request.authorStatus().equals("passed") &&
            !request.authorStatus().equals("default")) {
            throw new IllegalArgumentException("Invalid author-status. Must be 'passed' or 'default'");
        }
        
        // Parse tags: "spring,jpa" -> ["spring", "jpa"]
        List<String> tagList = parseTags(request.tags());
        
        Long requesterAccountId = (principal != null) ? principal.getAccountId() : null;

        // Build command
        ListTilCommand command = new ListTilCommand(
            request.authorStatus(),
            request.authorId(),
            request.authorName(),
            tagList,
            request.page(),
            request.size(),
            requesterAccountId
        );
        
        // Execute use case
        ListTilResult result = listTilUseCase.list(command);
        
        // Map to response DTO
        ListTilResponse response = ListTilResponse.from(result);
        
        // Standard envelope: Map.of("data", ...)
        return ResponseEntity.ok(Map.of("data", response));
    }
    
    /**
     * Parse comma-separated tags string into list
     * @param tags comma-separated string (e.g., "spring,jpa")
     * @return list of tags (never null, can be empty)
     */
    private List<String> parseTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .toList();
    }
}
