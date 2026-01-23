package com.b205.ozazak.application.auth.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CustomPrincipal {
    private final Long accountId;
    private final String email;
    private final String role;
}
