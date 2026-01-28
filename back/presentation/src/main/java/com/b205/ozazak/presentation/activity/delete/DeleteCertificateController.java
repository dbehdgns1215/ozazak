package com.b205.ozazak.presentation.activity.delete;

import com.b205.ozazak.application.activity.command.DeleteCertificateCommand;
import com.b205.ozazak.application.activity.result.DeleteCertificateResult;
import com.b205.ozazak.application.activity.service.DeleteCertificateService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/certification/{certificateId}")
@RequiredArgsConstructor
@Tag(name = "Certificate", description = "Certificate Management API")
public class DeleteCertificateController {

    private final DeleteCertificateService deleteCertificateService;

    @Operation(summary = "Delete a certificate")
    @DeleteMapping
    public ResponseEntity<ApiResponse<DeleteCertificateResponse>> deleteCertificate(
            @PathVariable Long userId,
            @PathVariable Long certificateId) {
        
        DeleteCertificateCommand command = new DeleteCertificateCommand(userId, certificateId);
        DeleteCertificateResult result = deleteCertificateService.execute(command);
        DeleteCertificateResponse response = new DeleteCertificateResponse(result.userId());

        return ResponseEntity.ok(ApiResponse.success("자격증 삭제 성공", response));
    }
}
