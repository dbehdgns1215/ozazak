package com.b205.ozazak.application.block.result;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UpdateBlockResult {
    private final Long blockId;
    private final String title;
    private final List<Integer> categories;  // 카테고리 코드 (0~14)
    private final String content;
}
