package com.b205.ozazak.domain.project.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.project.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Project {
    private final ProjectId id;
    private final Account account;
    private final ProjectTitle title;
    private final ProjectContent content;
    private final ProjectImage image;
    private final StartedAt startedAt;
    private final EndedAt endedAt;
    private final CreatedAt createdAt;
    private final UpdatedAt updatedAt;
    private final DeletedAt deletedAt;
}
