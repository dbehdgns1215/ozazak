package com.b205.ozazak.presentation.auth;

import com.b205.ozazak.application.auth.command.SignupCommand;
import com.b205.ozazak.application.auth.port.in.SignupUseCase;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.account.vo.Password;
import com.b205.ozazak.presentation.auth.dto.SignupRequest;
import com.b205.ozazak.presentation.auth.dto.SignupResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
        String jwt = signupUseCase.signup(SignupCommand.builder()
                .email(new Email(request.getEmail()))
                .password(new Password(request.getPassword()))
                .name(new AccountName(request.getName()))
                .verificationToken(request.getVerificationToken())
                .build());
        
        return ResponseEntity.ok(new SignupResponse(jwt));
    }
}
