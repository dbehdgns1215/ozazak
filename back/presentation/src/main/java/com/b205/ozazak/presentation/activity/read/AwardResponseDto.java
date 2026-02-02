package com.b205.ozazak.presentation.activity.read;

import java.util.List;

public record AwardResponseDto(
        Long awardId,
        String title,
        String rankName,
        String organization,
        String awardedAt
) {}
