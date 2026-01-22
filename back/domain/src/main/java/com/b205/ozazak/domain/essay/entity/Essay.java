package com.b205.ozazak.domain.essay.entity;

import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.essay.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Essay {
    private final EssayId id;
    private final Coverletter coverletter;
    private final Question question;
    private final EssayContent content;
    private final Version version;
    private final VersionTitle versionTitle;
    private final IsCurrent isCurrent;
    private final DeletedAt deletedAt;
}
