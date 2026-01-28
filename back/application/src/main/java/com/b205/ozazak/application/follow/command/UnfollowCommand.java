package com.b205.ozazak.application.follow.command;

public record UnfollowCommand(
        Long followerId,
        Long followeeId
) {}
