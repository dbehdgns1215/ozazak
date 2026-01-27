package com.b205.ozazak.application.auth.command;

import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.account.vo.Password;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PasswordResetCommand {
    private String email;
    private String password;
    private String resetToken;
}
