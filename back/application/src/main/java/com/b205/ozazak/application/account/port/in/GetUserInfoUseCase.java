package com.b205.ozazak.application.account.port.in;

import com.b205.ozazak.application.account.result.UserInfoResult;

public interface GetUserInfoUseCase {
    UserInfoResult getUserInfo(Long userId);
}
