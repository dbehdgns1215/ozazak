package com.b205.ozazak.presentation.follow.read;

import com.b205.ozazak.application.follow.command.GetFollowingCommand;
import com.b205.ozazak.application.follow.result.GetFollowingResult;
import com.b205.ozazak.application.follow.service.GetFollowingService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/followee")
@RequiredArgsConstructor
public class GetFollowingController {
    
    private final GetFollowingService getFollowingService;

    @GetMapping
    public ResponseEntity<ApiResponse<GetFollowingResponse>> getFollowing(
            @PathVariable Long userId
    ) {
        GetFollowingCommand command = new GetFollowingCommand(userId);
        GetFollowingResult result = getFollowingService.execute(command);
        
        // Result DTO -> Response DTO 변환
        List<FollowingUserDto> followingDtos = result.following().stream()
                .map(dto -> new FollowingUserDto(
                        dto.userId(),
                        dto.name(),
                        dto.image(),
                        dto.isFollowed()
                ))
                .toList();
        
        GetFollowingResponse response = new GetFollowingResponse(result.userId(), followingDtos);
        
        return ResponseEntity.ok(ApiResponse.success(
                "팔로위 조회 성공",
                response
        ));
    }
}
