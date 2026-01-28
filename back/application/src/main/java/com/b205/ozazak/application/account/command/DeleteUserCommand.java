package com.b205.ozazak.application.account.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteUserCommand {
    private final Long userId;
}
