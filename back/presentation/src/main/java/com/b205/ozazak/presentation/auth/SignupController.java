package com.b205.ozazak.presentation.auth;

import com.b205.ozazak.application.auth.port.in.SignupUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class SignupController {

    private final SignupUseCase signupUseCase;

    @Operation(summary = "Registration with email verification token")
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        String jwt = signupUseCase.signup(SignupUseCase.SignupCommand.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .verificationToken(request.getVerificationToken())
                .build());
        
        return ResponseEntity.ok(new SignupResponse(jwt));
    }

    @Getter
    @Setter
    public static class SignupRequest {
        @NotBlank @Email
        private String email;

        @NotBlank @Size(min = 8)
        private String password;

        @NotBlank @Size(min = 2)
        private String name;

        @NotBlank
        private String verificationToken;
    }

    @Getter
    @RequiredArgsConstructor
    public static class SignupResponse {
        private final String accessToken;
    }
}
