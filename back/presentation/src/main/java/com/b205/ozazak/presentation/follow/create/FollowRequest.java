package com.b205.ozazak.presentation.follow.create;

import jakarta.validation.constraints.NotNull;

public record FollowRequest(
        @NotNull(message = "Followee ID must not be null")
        Long followeeId
) {}
