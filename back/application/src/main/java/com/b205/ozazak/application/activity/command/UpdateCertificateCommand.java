package com.b205.ozazak.application.activity.command;

public record UpdateCertificateCommand(
        Long accountId,
        Long certificateId,
        String title,
        String rankName,
        String organization,
        String awardedAt
) {}
