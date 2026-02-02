package com.b205.ozazak.application.activity.command;

public record DeleteAwardCommand(
        Long accountId,
        Long awardId
) {}
