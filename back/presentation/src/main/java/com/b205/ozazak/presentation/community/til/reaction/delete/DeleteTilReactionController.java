package com.b205.ozazak.presentation.community.til.reaction.delete;
 
import com.b205.ozazak.application.community.command.DeleteTilReactionCommand;
import com.b205.ozazak.application.community.port.in.DeleteTilReactionUseCase;
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
public class DeleteTilReactionController {
 
    private final DeleteTilReactionUseCase deleteTilReactionUseCase;
 
    @DeleteMapping("/{tilId}/reaction")
    @Operation(summary = "Remove Reaction from TIL", 
               description = "Remove a reaction from a specific TIL. Requires JSON body with reaction type.")
    public ResponseEntity<Map<String, Object>> deleteReaction(
        @PathVariable Long tilId,
        @RequestBody @Valid DeleteTilReactionRequest body,
        @AuthenticationPrincipal CustomPrincipal principal
    ) {
        // 1. Delete Reaction
        deleteTilReactionUseCase.deleteReaction(new DeleteTilReactionCommand(
            tilId,
            principal.getAccountId(),
            body.reaction().type()
        ));
 
        // 2. Return Simple Success Response
        return ResponseEntity.ok(Map.of("data", Map.of("success", true)));
    }
}
