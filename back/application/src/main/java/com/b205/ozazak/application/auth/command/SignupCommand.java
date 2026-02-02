package com.b205.ozazak.application.auth.command;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.account.vo.Password;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignupCommand {
    private final String email;
    private final String password;
    private final String name;
    private final String verificationToken;
}