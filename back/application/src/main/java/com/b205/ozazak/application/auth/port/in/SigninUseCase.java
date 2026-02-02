package com.b205.ozazak.application.auth.port.in;

import com.b205.ozazak.application.auth.command.SigninCommand;

public interface SigninUseCase {
    String signin(SigninCommand command);
}
