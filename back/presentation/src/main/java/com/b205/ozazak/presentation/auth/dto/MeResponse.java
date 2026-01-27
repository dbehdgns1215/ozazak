package com.b205.ozazak.presentation.auth.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MeResponse {
    private final Long accountId;
    private final String email;
    private final String role;
}
