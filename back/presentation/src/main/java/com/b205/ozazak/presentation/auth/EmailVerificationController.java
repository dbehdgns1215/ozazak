package com.b205.ozazak.presentation.auth;

import com.b205.ozazak.application.auth.port.in.EmailVerificationUseCase;
import com.b205.ozazak.presentation.auth.dto.VerificationRequest;
import com.b205.ozazak.presentation.auth.dto.ConfirmationRequest;
import com.b205.ozazak.presentation.auth.dto.VerificationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "Authentication and Verification API")
@RestController
@RequestMapping("/api/auth/email/verification")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationUseCase emailVerificationUseCase;

    @Operation(summary = "Request email verification code")
    @PostMapping("/request")
    public ResponseEntity<Void> requestVerification(@Valid @RequestBody VerificationRequest request) {
        emailVerificationUseCase.requestVerification(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Confirm email verification code")
    @PostMapping("/confirm")
    public ResponseEntity<VerificationResponse> confirmVerification(@Valid @RequestBody ConfirmationRequest request) {
        String token = emailVerificationUseCase.confirmVerification(request.getEmail(), request.getCode());
        return ResponseEntity.ok(new VerificationResponse(token));
    }
}
