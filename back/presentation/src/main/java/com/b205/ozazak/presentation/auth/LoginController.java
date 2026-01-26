package com.b205.ozazak.presentation.auth;

import com.b205.ozazak.application.auth.port.in.LoginUseCase;
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
public class LoginController {

    private final LoginUseCase loginUseCase;

    @Operation(summary = "Login with email and password")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String jwt = loginUseCase.login(LoginUseCase.LoginCommand.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build());
        
        return ResponseEntity.ok(new LoginResponse(jwt));
    }
}
