package com.b205.ozazak.presentation.follow.read;

import com.b205.ozazak.application.follow.command.GetFollowersCommand;
import com.b205.ozazak.application.follow.result.GetFollowersResult;
import com.b205.ozazak.application.follow.service.GetFollowersService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users/{userId}/follower")
@RequiredArgsConstructor
@Tag(name = "Follow", description = "Follow Management API")
public class GetFollowersController {

    private final GetFollowersService getFollowersService;

    @Operation(summary = "Get user followers list")
    @GetMapping
    public ResponseEntity<ApiResponse<GetFollowersResponse>> getFollowers(
            @PathVariable Long userId) {
        
        GetFollowersCommand command = new GetFollowersCommand(userId);
        GetFollowersResult result = getFollowersService.execute(command);
        
        GetFollowersResponse response = new GetFollowersResponse(
                result.userId(),
                result.followers().stream()
                        .map(follower -> new FollowUserDto(
                                follower.userId(),
                                follower.name(),
                                follower.image(),
                                follower.isFollowed()
                        ))
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(ApiResponse.success("팔로워 조회 성공", response));
    }
}
