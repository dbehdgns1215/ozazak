package com.b205.ozazak.presentation.auth;

import com.b205.ozazak.application.auth.command.LoginCommand;
import com.b205.ozazak.application.auth.port.in.SigninUseCase;
import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.account.vo.Password;
import com.b205.ozazak.presentation.auth.dto.LoginRequest;
import com.b205.ozazak.presentation.auth.dto.LoginResponse;
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
public class SigninController {

    private final SigninUseCase signinUseCase;

    @Operation(summary = "Login with email and password")
    @PostMapping("/signin")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String jwt = signinUseCase.signin(LoginCommand.builder()
                .email(new Email(request.getEmail()))
                .password(new Password(request.getPassword()))
                .build());
        
        return ResponseEntity.ok(new LoginResponse(jwt));
    }
}
