package com.b205.ozazak.presentation.account.read;

import com.b205.ozazak.application.account.port.in.GetUserInfoUseCase;
import com.b205.ozazak.application.account.result.UserInfoResult;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Users", description = "User Info API")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserInfoController {

    private final GetUserInfoUseCase getUserInfoUseCase;

    @Operation(summary = "Get user information by userId")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getUserInfo(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long userId) {
        
        UserInfoResult result = getUserInfoUseCase.getUserInfo(userId);
        UserInfoResponse response = mapToResponse(result);
        
        return ResponseEntity.ok(ApiResponse.success("유저 정보 조회 성공", response));
    }

    private UserInfoResponse mapToResponse(UserInfoResult result) {
        return UserInfoResponse.builder()
                .accountId(result.getAccountId())
                .email(result.getEmail())
                .name(result.getName())
                .role(result.getRole())
                .img(result.getImg())
                .createdAt(result.getCreatedAt())
                .followerCount(result.getFollowerCount())
                .followeeCount(result.getFolloweeCount())
                .build();
    }
}
