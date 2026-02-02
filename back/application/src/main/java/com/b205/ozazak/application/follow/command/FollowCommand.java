package com.b205.ozazak.application.follow.command;

public record FollowCommand(
        Long followerId,
        Long followeeId
) {}
