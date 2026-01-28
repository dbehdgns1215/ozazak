package com.b205.ozazak.application.bookmark.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteBookmarkCommand {
    private final Long accountId;
    private final Long recruitmentId;
}
