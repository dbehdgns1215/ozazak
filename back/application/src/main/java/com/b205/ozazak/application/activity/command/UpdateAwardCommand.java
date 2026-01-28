package com.b205.ozazak.application.activity.command;

public record UpdateAwardCommand(
        Long accountId,
        Long awardId,
        String title,
        String rankName,
        String organization,
        String awardedAt
) {}
