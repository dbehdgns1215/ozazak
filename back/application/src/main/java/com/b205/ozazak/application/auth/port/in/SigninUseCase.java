package com.b205.ozazak.application.auth.port.in;

import com.b205.ozazak.application.auth.command.LoginCommand;
import com.b205.ozazak.domain.account.vo.Email;
import lombok.Builder;
import lombok.Getter;

public interface SigninUseCase {
    String signin(LoginCommand command);
}
