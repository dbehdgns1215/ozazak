package com.b205.ozazak.application.account.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateUserInfoCommand {
    private final Long userId;
    private final String name;
    private final String email;
    private final String img;
}
