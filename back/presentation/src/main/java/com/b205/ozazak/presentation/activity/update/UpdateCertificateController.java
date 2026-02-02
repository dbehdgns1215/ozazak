package com.b205.ozazak.presentation.activity.update;

import com.b205.ozazak.application.activity.command.UpdateCertificateCommand;
import com.b205.ozazak.application.activity.result.UpdateCertificateResult;
import com.b205.ozazak.application.activity.service.UpdateCertificateService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/certification/{certificateId}")
@RequiredArgsConstructor
@Tag(name = "Certificate", description = "Certificate Management API")
public class UpdateCertificateController {

    private final UpdateCertificateService updateCertificateService;

    @Operation(summary = "Update a certificate")
    @PutMapping
    public ResponseEntity<ApiResponse<UpdateCertificateResponse>> updateCertificate(
            @PathVariable Long userId,
            @PathVariable Long certificateId,
            @Valid @RequestBody UpdateCertificateRequest request) {
        
        UpdateCertificateCommand command = new UpdateCertificateCommand(
                userId,
                certificateId,
                request.title(),
                request.rankName(),
                request.organization(),
                request.awardedAt()
        );

        UpdateCertificateResult result = updateCertificateService.execute(command);
        UpdateCertificateResponse response = new UpdateCertificateResponse(result.userId());

        return ResponseEntity.ok(ApiResponse.success("자격증 수정 성공", response));
    }
}
