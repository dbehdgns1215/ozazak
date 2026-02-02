package com.b205.ozazak.presentation.activity.create;

import com.b205.ozazak.application.activity.command.CreateCertificateCommand;
import com.b205.ozazak.application.activity.result.CreateCertificateResult;
import com.b205.ozazak.application.activity.service.CreateCertificateService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/certification")
@RequiredArgsConstructor
@Tag(name = "Certificate", description = "Certificate Management API")
public class CreateCertificateController {

    private final CreateCertificateService createCertificateService;

    @Operation(summary = "Create a new certificate")
    @PostMapping
    public ResponseEntity<ApiResponse<CreateCertificateResponse>> createCertificate(
            @PathVariable Long userId,
            @Valid @RequestBody CreateCertificateRequest request) {
        
        CreateCertificateCommand command = new CreateCertificateCommand(
                userId,
                request.title(),
                request.rankName(),
                request.organization(),
                request.awardedAt()
        );

        CreateCertificateResult result = createCertificateService.execute(command);
        CreateCertificateResponse response = new CreateCertificateResponse(result.userId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("자격증 등록 성공", response));
    }
}
