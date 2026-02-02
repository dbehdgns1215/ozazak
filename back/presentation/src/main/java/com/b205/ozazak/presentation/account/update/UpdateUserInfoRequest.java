package com.b205.ozazak.presentation.account.update;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Schema(description = "Update User Info Request")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserInfoRequest {
    
    @Schema(description = "User name", example = "김철수")
    @NotBlank(message = "Name cannot be blank")
    private String name;
    
    @Schema(description = "User email", example = "test@example.com")
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email must be valid")
    private String email;
    
    @Schema(description = "User image URL", example = "https://example.com/image.jpg")
    private String img;
}
