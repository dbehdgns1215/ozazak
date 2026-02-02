package com.b205.ozazak.presentation.follow.delete;

import com.b205.ozazak.application.follow.command.UnfollowCommand;
import com.b205.ozazak.application.follow.result.UnfollowResult;
import com.b205.ozazak.application.follow.service.UnfollowService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/follower")
@RequiredArgsConstructor
@Tag(name = "Follow", description = "Follow Management API")
public class UnfollowController {

    private final UnfollowService unfollowService;

    @Operation(summary = "Unfollow a user")
    @DeleteMapping("/{followeeId}")
    public ResponseEntity<ApiResponse<UnfollowResponse>> unfollow(
            @PathVariable Long userId,
            @PathVariable Long followeeId) {
        
        UnfollowCommand command = new UnfollowCommand(userId, followeeId);
        UnfollowResult result = unfollowService.execute(command);
        UnfollowResponse response = new UnfollowResponse(result.followerId());

        return ResponseEntity.ok(ApiResponse.success("언팔로우 성공", response));
    }
}
