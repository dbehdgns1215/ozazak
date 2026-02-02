package com.b205.ozazak.application.activity.command;

public record DeleteCertificateCommand(
        Long accountId,
        Long certificateId
) {}
