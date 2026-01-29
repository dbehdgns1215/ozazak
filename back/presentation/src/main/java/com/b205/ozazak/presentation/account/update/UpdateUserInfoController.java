package com.b205.ozazak.presentation.account.update;

import com.b205.ozazak.application.account.port.in.UpdateUserInfoUseCase;
import com.b205.ozazak.application.account.command.UpdateUserInfoCommand;
import com.b205.ozazak.application.account.result.UpdateUserInfoResult;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@Tag(name = "Users", description = "User Info API")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UpdateUserInfoController {

    private final UpdateUserInfoUseCase updateUserInfoUseCase;

    @Operation(summary = "Update user information")
    @SecurityRequirement(name = "Bearer Authentication")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UpdateUserInfoResponse>> updateUserInfo(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserInfoRequest request) {
        
        UpdateUserInfoCommand command = UpdateUserInfoCommand.builder()
                .userId(userId)
                .name(request.getName())
                .email(request.getEmail())
                .img(request.getImg())
                .build();
        
        UpdateUserInfoResult result = updateUserInfoUseCase.updateUserInfo(command);
        UpdateUserInfoResponse response = mapToResponse(result);
        
        return ResponseEntity.ok(ApiResponse.success("유저 정보 수정 성공", response));
    }

    private UpdateUserInfoResponse mapToResponse(UpdateUserInfoResult result) {
        return UpdateUserInfoResponse.builder()
                .userId(result.getUserId())
                .build();
    }
}
