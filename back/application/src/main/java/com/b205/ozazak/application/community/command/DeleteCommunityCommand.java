package com.b205.ozazak.application.community.command;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class DeleteCommunityCommand {
    private final Long communityId;
    private final Long accountId;
    private final boolean isAdmin;
}
