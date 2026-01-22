package com.b205.ozazak.domain.coverletter.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import com.b205.ozazak.domain.coverletter.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Coverletter {
    private final CoverletterId id;
    private final Account account;
    private final Recruitment recruitment;
    private final CoverletterTitle title;
    private final IsComplete isComplete;
    private final IsPassed isPassed;
    private final CreatedAt createdAt;
    private final UpdatedAt updatedAt;
    private final DeletedAt deletedAt;
}
