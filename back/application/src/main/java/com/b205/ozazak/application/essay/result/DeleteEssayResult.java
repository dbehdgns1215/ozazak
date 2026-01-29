package com.b205.ozazak.application.essay.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteEssayResult {
    private final Long deletedEssayId;
}
