package com.b205.ozazak.domain.account.entity;

import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.account.vo.*;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class Account {
    private final AccountId id;
    private final Email email;
    private Password password;
    private final AccountName name;
    private final AccountImg img;
    private final Integer roleCode;
    private final Company company;
    private final LocalDateTime createdAt;
    private final LocalDateTime deletedAt;
    
    public void updatePassword(Password newPassword) {
        this.password = newPassword;
    }
}

