package com.b205.ozazak.application.follow.result;

import java.util.List;

public record GetFollowingResult(
        Long userId,
        List<FollowUserDto> following
) {
    public record FollowUserDto(
            Long userId,
            String name,
            String image,
            boolean isFollowed
    ) {
    }
}
