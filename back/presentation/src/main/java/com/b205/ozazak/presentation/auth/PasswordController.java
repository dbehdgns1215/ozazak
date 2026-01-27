package com.b205.ozazak.presentation.auth;

import com.b205.ozazak.application.auth.port.in.PasswordUseCase;
import com.b205.ozazak.presentation.auth.dto.PasswordResetRequest;
import com.b205.ozazak.presentation.auth.dto.PasswordChangeRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "Authentication and Password API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordController {
    
    private final PasswordUseCase passwordUseCase;

    @Operation(summary = "Request password reset (send reset token to email)")
    @PostMapping("/temp-password")
    public ResponseEntity<Void> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        passwordUseCase.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Reset password with reset token")
    @PutMapping("/password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody PasswordChangeRequest request) {
        passwordUseCase.resetPassword(request.getEmail(), request.getResetToken(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
}
