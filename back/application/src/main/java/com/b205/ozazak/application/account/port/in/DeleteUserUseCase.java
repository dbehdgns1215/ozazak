package com.b205.ozazak.application.account.port.in;

import com.b205.ozazak.application.account.command.DeleteUserCommand;
import com.b205.ozazak.application.account.result.DeleteUserResult;

public interface DeleteUserUseCase {
    DeleteUserResult deleteUser(DeleteUserCommand command);
}
