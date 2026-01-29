package com.b205.ozazak.application.block.command;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UpdateBlockCommand {
    private final Long blockId;
    private final Long accountId;
    private final String title;
    private final String content;
    private final List<String> categories;  // ← String[]로 변경
}
