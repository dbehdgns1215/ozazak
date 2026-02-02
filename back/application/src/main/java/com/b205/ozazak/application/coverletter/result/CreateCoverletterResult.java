package com.b205.ozazak.application.coverletter.result;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CreateCoverletterResult {
    private final Long coverletterId;
    private final String title;
    private final List<Long> essayIds;
}
