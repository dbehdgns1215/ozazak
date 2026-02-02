package com.b205.ozazak.presentation.follow.read;

public record FollowUserDto(
        Long userId,
        String name,
        String image,
        Boolean isFollowed
) {}
