package com.b205.ozazak.presentation.follow.create;

import com.b205.ozazak.application.follow.command.FollowCommand;
import com.b205.ozazak.application.follow.result.FollowResult;
import com.b205.ozazak.application.follow.service.FollowService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/follower")
@RequiredArgsConstructor
@Tag(name = "Follow", description = "Follow Management API")
public class FollowController {

    private final FollowService followService;

    @Operation(summary = "Follow a user")
    @PostMapping
    public ResponseEntity<ApiResponse<FollowResponse>> follow(
            @PathVariable Long userId,
            @Valid @RequestBody FollowRequest request) {
        
        FollowCommand command = new FollowCommand(userId, request.followeeId());
        FollowResult result = followService.execute(command);
        FollowResponse response = new FollowResponse(result.followerId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("팔로우 성공", response));
    }
}
