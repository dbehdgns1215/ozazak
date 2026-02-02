package com.b205.ozazak.presentation.follow.read;

import java.util.List;

public record GetFollowingResponse(
        Long userId,
        List<FollowingUserDto> following
) {
}
