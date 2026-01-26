package com.b205.ozazak.domain.project.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.project.vo.*;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class Project {
    private final ProjectId projectId;
    private final Account author;
    private final ProjectTitle title;
    private final ProjectContent content;
    private final ProjectImage image;
    private final StartedAt startedAt;
    private final EndedAt endedAt;
    private final CreatedAt createdAt;
    private final UpdatedAt updatedAt;
    private final DeletedAt deletedAt;

    private final List<String> tags;

    public void validateDateRange() {
        if (startedAt != null && endedAt != null) {
            if (endedAt.value().isBefore(startedAt.value())) {
                throw new IllegalArgumentException("종료일은 시작일보다 빠를 수 없습니다");
            }
        }
    }
}

