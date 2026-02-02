package com.b205.ozazak.application.account.port.in;

import com.b205.ozazak.application.account.command.UpdateUserInfoCommand;
import com.b205.ozazak.application.account.result.UpdateUserInfoResult;

public interface UpdateUserInfoUseCase {
    UpdateUserInfoResult updateUserInfo(UpdateUserInfoCommand command);
}
