package com.b205.ozazak.application.auth.port.in;

import com.b205.ozazak.application.auth.command.SignupCommand;
import lombok.Builder;
import lombok.Getter;

public interface SignupUseCase {
    String signup(SignupCommand command);
}
