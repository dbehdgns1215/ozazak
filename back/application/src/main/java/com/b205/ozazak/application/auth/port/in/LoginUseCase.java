package com.b205.ozazak.application.auth.port.in;

import lombok.Builder;
import lombok.Getter;

public interface LoginUseCase {
    String login(LoginCommand command);

    @Getter
    @Builder
    class LoginCommand {
        private final String email;
        private final String password;
    }
}
