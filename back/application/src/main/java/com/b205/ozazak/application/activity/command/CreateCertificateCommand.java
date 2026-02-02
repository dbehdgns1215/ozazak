package com.b205.ozazak.application.activity.command;

public record CreateCertificateCommand(
        Long accountId,
        String title,
        String rankName,
        String organization,
        String awardedAt
) {}
