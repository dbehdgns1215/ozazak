package com.b205.ozazak.presentation.auth;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.presentation.auth.dto.MeResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth")
@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    @Operation(summary = "Get current authenticated user info")
    @GetMapping
    public ResponseEntity<MeResponse> getMe(@AuthenticationPrincipal CustomPrincipal principal) {
        return ResponseEntity.ok(new MeResponse(
                principal.getAccountId(),
                principal.getEmail(),
                principal.getName(),
                principal.getRole()
        ));
    }
}
