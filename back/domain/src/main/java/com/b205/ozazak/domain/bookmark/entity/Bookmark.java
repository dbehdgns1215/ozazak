package com.b205.ozazak.domain.bookmark.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import com.b205.ozazak.domain.bookmark.vo.CreatedAt;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Bookmark {
    private final Account account;
    private final Recruitment recruitment;
    private final CreatedAt createdAt;
}
