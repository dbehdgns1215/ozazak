package com.b205.ozazak.application.block.result;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UpdateBlockResult {
    private final Long blockId;
    private final String title;
    private final List<String> categories;  // ← String[] 이름으로 반환
    private final String content;
}
