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

    public Coverletter softDelete() {
        return Coverletter.builder()
                .id(this.id)
                .account(this.account)
                .recruitment(this.recruitment)
                .title(this.title)
                .isComplete(this.isComplete)
                .isPassed(this.isPassed)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .deletedAt(new DeletedAt(java.time.LocalDateTime.now()))  // ← deletedAt 설정
                .build();
    }
}
