package com.b205.ozazak.domain.account.entity;

import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.account.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Account {
    private final AccountId id;
    private final AccountName name;
    private final AccountImg img;
    private final Company company;
}
