package com.b205.ozazak.application.activity.command;

public record CreateAwardCommand(
        Long accountId,
        String title,
        String rankName,
        String organization,
        String awardedAt
) {}
