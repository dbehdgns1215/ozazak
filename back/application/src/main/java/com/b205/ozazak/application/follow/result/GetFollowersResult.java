package com.b205.ozazak.application.follow.result;

import java.util.List;

public record GetFollowersResult(
        Long userId,
        List<FollowUserDto> followers
) {
    public record FollowUserDto(
            Long userId,
            String name,
            String image,
            Boolean isFollowed
    ) {}
}
