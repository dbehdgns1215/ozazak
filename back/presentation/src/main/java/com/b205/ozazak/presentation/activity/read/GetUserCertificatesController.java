package com.b205.ozazak.presentation.activity.read;

import com.b205.ozazak.application.activity.result.GetUserCertificatesResult;
import com.b205.ozazak.application.activity.service.GetUserCertificatesService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users/{userId}/certification")
@RequiredArgsConstructor
@Tag(name = "Certificate", description = "Certificate Management API")
public class GetUserCertificatesController {

    private final GetUserCertificatesService getUserCertificatesService;

    @Operation(summary = "Get user certificates list")
    @GetMapping
    public ResponseEntity<ApiResponse<GetUserCertificatesResponse>> getUserCertificates(
            @PathVariable Long userId) {
        
        GetUserCertificatesResult result = getUserCertificatesService.execute(userId);
        
        GetUserCertificatesResponse response = new GetUserCertificatesResponse(
                result.userId(),
                result.certificates().stream()
                        .map(certificate -> new CertificateResponseDto(
                                certificate.certificateId(),
                                certificate.title(),
                                certificate.rankName(),
                                certificate.organization(),
                                certificate.awardedAt()
                        ))
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(ApiResponse.success("자격증 조회 성공", response));
    }
}
