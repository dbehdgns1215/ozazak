package com.b205.ozazak.presentation.follow.read;

import java.util.List;

public record GetFollowersResponse(
        Long userId,
        List<FollowUserDto> followers
) {}
