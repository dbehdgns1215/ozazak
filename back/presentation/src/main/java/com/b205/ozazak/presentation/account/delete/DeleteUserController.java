package com.b205.ozazak.presentation.account.delete;

import com.b205.ozazak.application.account.port.in.DeleteUserUseCase;
import com.b205.ozazak.application.account.command.DeleteUserCommand;
import com.b205.ozazak.application.account.result.DeleteUserResult;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Users", description = "User Info API")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class DeleteUserController {

    private final DeleteUserUseCase deleteUserUseCase;

    @Operation(summary = "Delete user account (Soft Delete)")
    @SecurityRequirement(name = "Bearer Authentication")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<DeleteUserResponse>> deleteUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long userId) {
        
        DeleteUserCommand command = DeleteUserCommand.builder()
                .userId(userId)
                .build();
        
        DeleteUserResult result = deleteUserUseCase.deleteUser(command);
        DeleteUserResponse response = mapToResponse(result);
        
        return ResponseEntity.ok(ApiResponse.success("유저 탈퇴 성공", response));
    }

    private DeleteUserResponse mapToResponse(DeleteUserResult result) {
        return DeleteUserResponse.builder()
                .userId(result.getUserId())
                .build();
    }
}
