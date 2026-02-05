package com.b205.ozazak.presentation.community.til.reaction.create;

import com.b205.ozazak.application.community.command.CreateTilReactionCommand;
import com.b205.ozazak.application.community.port.in.CreateTilReactionUseCase;
import com.b205.ozazak.application.auth.model.CustomPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
 
import java.util.Map;

@RestController
@RequestMapping("/api/til")
@Tag(name = "Community", description = "Community API")
@RequiredArgsConstructor
public class CreateTilReactionController {
 
    private final CreateTilReactionUseCase createTilReactionUseCase;
 
    @PostMapping("/{tilId}/reaction")
    @Operation(summary = "Add Reaction to TIL", description = "Add a reaction to a specific TIL")
    public ResponseEntity<Map<String, Object>> createReaction(
        @PathVariable Long tilId,
        @RequestBody @Valid CreateTilReactionRequest body,
        @AuthenticationPrincipal CustomPrincipal principal
    ) {
        // 1. Create Reaction
        createTilReactionUseCase.createReaction(new CreateTilReactionCommand(
            tilId,
            principal.getAccountId(),
            body.reaction().type()
        ));
 
        // 2. Return Simple Success Response
        return ResponseEntity.ok(Map.of("data", Map.of("success", true)));
    }
}
