package com.b205.ozazak.presentation.community.til.reaction.create;

import com.b205.ozazak.application.community.command.CreateTilReactionCommand;
import com.b205.ozazak.application.community.command.ListTilCommand;
import com.b205.ozazak.application.community.port.in.CreateTilReactionUseCase;
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
public class CreateTilReactionController {

    private final CreateTilReactionUseCase createTilReactionUseCase;
    private final ListTilUseCase listTilUseCase;

    @PostMapping("/{tilId}/reaction")
    @Operation(summary = "Add Reaction to TIL", description = "Add a reaction and return the refreshed TIL list")
    public ResponseEntity<Map<String, Object>> createReaction(
        @PathVariable Long tilId,
        @RequestBody @Valid CreateTilReactionRequest body,
        @ModelAttribute @Valid ListTilRequest listRequest,
        @AuthenticationPrincipal CustomPrincipal principal
    ) {
        // 1. Create Reaction
        createTilReactionUseCase.createReaction(new CreateTilReactionCommand(
            tilId,
            principal.getAccountId(),
            body.reaction().type()
        ));

        // 2. Refresh List (Reuse ListTilLogic)
        List<String> tags = Collections.emptyList();
        if (listRequest.tags() != null && !listRequest.tags().isBlank()) {
            tags = Arrays.stream(listRequest.tags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }

        ListTilCommand listCommand = new ListTilCommand(
            listRequest.authorStatus(),
            tags,
            listRequest.page(),
            listRequest.size(),
            listRequest.authorId()
        );

        ListTilResult result = listTilUseCase.list(listCommand);

        // 3. Return Response (Reuse ListTilResponse)
        return ResponseEntity.ok(Map.of("data", ListTilResponse.from(result)));
    }
}
