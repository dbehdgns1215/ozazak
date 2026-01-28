package com.b205.ozazak.domain.resume.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.resume.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Resume {
    private final ResumeId id;
    private final Account account;
    private final ResumeTitle title;
    private final ResumeContent content;
    private final StartedAt startedAt;
    private final EndedAt endedAt;
}
