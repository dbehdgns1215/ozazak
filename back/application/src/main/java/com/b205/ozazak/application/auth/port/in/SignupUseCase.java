package com.b205.ozazak.application.auth.port.in;

import lombok.Builder;
import lombok.Getter;

public interface SignupUseCase {
    String signup(SignupCommand command);

    @Getter
    @Builder
    class SignupCommand {
        private final String email;
        private final String password;
        private final String name;
        private final String verificationToken;
    }
}
