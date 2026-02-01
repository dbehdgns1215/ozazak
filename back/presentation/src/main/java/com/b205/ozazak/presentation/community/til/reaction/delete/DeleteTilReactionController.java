package com.b205.ozazak.presentation.community.til.reaction.delete;

import com.b205.ozazak.application.community.command.DeleteTilReactionCommand;
import com.b205.ozazak.application.community.command.ListTilCommand;
import com.b205.ozazak.application.community.port.in.DeleteTilReactionUseCase;
import com.b205.ozazak.application.community.port.in.ListTilUseCase;
import com.b205.ozazak.application.community.result.ListTilResult;
import com.b205.ozazak.presentation.community.til.ListTilRequest;
import com.b205.ozazak.presentation.community.til.ListTilResponse;
import com.b205.ozazak.application.auth.model.CustomPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/til")
@Tag(name = "Community", description = "Community API")
@RequiredArgsConstructor
public class DeleteTilReactionController {

    private final DeleteTilReactionUseCase deleteTilReactionUseCase;
    private final ListTilUseCase listTilUseCase;

    @DeleteMapping("/{tilId}/reaction")
    @Operation(summary = "Remove Reaction from TIL", 
               description = "Remove a reaction and return the refreshed TIL list. Requires JSON body with reaction type.")
    public ResponseEntity<Map<String, Object>> deleteReaction(
        @PathVariable Long tilId,
        @RequestBody @Valid DeleteTilReactionRequest body,
        @ModelAttribute @Valid ListTilRequest listRequest,
        @AuthenticationPrincipal CustomPrincipal principal
    ) {
        // 1. Delete Reaction
        deleteTilReactionUseCase.deleteReaction(new DeleteTilReactionCommand(
            tilId,
            principal.getAccountId(),
            body.reaction().type()
        ));

        // 2. Refresh List
        List<String> tags = Collections.emptyList();
        if (listRequest.tags() != null && !listRequest.tags().isBlank()) {
            tags = Arrays.stream(listRequest.tags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }

        ListTilCommand listCommand = new ListTilCommand(
            listRequest.authorStatus(),
            listRequest.authorId(),
            listRequest.authorName(),
            tags,
            listRequest.page(),
            listRequest.size()
        );

        ListTilResult result = listTilUseCase.list(listCommand);

        // 3. Return Response
        return ResponseEntity.ok(Map.of("data", ListTilResponse.from(result)));
    }
}
