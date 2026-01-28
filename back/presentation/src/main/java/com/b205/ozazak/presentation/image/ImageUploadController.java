package com.b205.ozazak.presentation.image;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.image.command.UploadImageCommand;
import com.b205.ozazak.application.image.port.in.UploadImageUseCase;
import com.b205.ozazak.application.image.result.UploadImageResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageUploadController {

    private final UploadImageUseCase uploadImageUseCase;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @RequestParam("img") MultipartFile file,
            @AuthenticationPrincipal CustomPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("code", "UNAUTHORIZED", "message", "Authentication required"));
        }

        if (file.isEmpty()) {
            throw new CommunityException(CommunityErrorCode.BAD_REQUEST);
        }

        try {
            UploadImageCommand command = UploadImageCommand.builder()
                    .uploaderId(principal.getAccountId())
                    .imageBytes(file.getBytes())
                    .sizeBytes(file.getSize())
                    .contentType(file.getContentType()) // Note: Service validates signature, this is just info
                    .build();

            UploadImageResult result = uploadImageUseCase.upload(command);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("data", result));

        } catch (IOException e) {
            throw new CommunityException(CommunityErrorCode.IMAGE_PROCESSING_ERROR);
        }
    }
}
