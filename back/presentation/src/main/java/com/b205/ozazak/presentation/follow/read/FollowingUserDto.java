package com.b205.ozazak.presentation.follow.read;

public record FollowingUserDto(
        Long userId,
        String name,
        String image,
        boolean isFollowed
) {
}
