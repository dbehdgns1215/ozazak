package com.b205.ozazak.presentation.community.til;

import com.b205.ozazak.application.community.command.ListTilCommand;
import com.b205.ozazak.application.community.port.in.ListTilUseCase;
import com.b205.ozazak.application.community.result.ListTilResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        @ModelAttribute @Valid ListTilRequest request
    ) {
        // Parse tags: "spring,jpa" -> ["spring", "jpa"]
        List<String> tagList = parseTags(request.tags());
        
        // Build command
        ListTilCommand listCommand = new ListTilCommand(
            tagList,
            request.page(),
            request.size(),
            request.authorName()
        );
        
        // Execute use case
        ListTilResult result = listTilUseCase.list(listCommand);
        
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
