package com.b205.ozazak.presentation.activity.read;

import java.util.List;

public record GetUserAwardsResponse(
        Long userId,
        List<AwardResponseDto> awards
) {}
