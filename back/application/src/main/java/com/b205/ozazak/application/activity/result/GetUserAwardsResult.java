package com.b205.ozazak.application.activity.result;

import java.util.List;

public record GetUserAwardsResult(
        Long userId,
        List<AwardDataDto> awards
) {
    public record AwardDataDto(
            Long awardId,
            String title,
            String rankName,
            String organization,
            String awardedAt
    ) {}
}
