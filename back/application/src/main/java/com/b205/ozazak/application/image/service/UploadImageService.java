package com.b205.ozazak.application.image.service;

import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.image.command.UploadImageCommand;
import com.b205.ozazak.application.image.port.in.UploadImageUseCase;
import com.b205.ozazak.application.image.port.out.ImageMetadataPort;
import com.b205.ozazak.application.image.port.out.ImageProcessingPort;
import com.b205.ozazak.application.image.port.out.ImageStoragePort;
import com.b205.ozazak.application.image.port.out.UploadIdGeneratorPort;
import com.b205.ozazak.application.image.port.out.dto.ImageMeta;
import com.b205.ozazak.application.image.result.UploadImageResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadImageService implements UploadImageUseCase {

    private final UploadIdGeneratorPort uploadIdGeneratorPort;
    private final ImageMetadataPort imageMetadataPort;
    private final ImageProcessingPort imageProcessingPort;
    private final ImageStoragePort imageStoragePort;

    private static final long MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    private static final Map<String, Integer> RESIZE_TARGETS = Map.of(
            "large", 1280,
            "medium", 768,
            "thumb", 256
    );

    @Override
    public UploadImageResult upload(UploadImageCommand command) {
        // 1. Validate Size (Double check)
        if (command.getSizeBytes() > MAX_SIZE_BYTES) {
            throw new CommunityException(CommunityErrorCode.PAYLOAD_TOO_LARGE);
        }

        // 2. Validate MIME via Signature
        validateImageSignature(command.getImageBytes());

        // 3. Generate Upload ID
        UUID uploadId = uploadIdGeneratorPort.generate();
        String uploadIdStr = uploadId.toString();

        // 4. Extract Metadata
        ImageMeta originalMeta = imageMetadataPort.extract(command.getImageBytes());

        Map<String, String> uploadedUrls = new HashMap<>();

        // 5. Sequential Processing & Upload

        // A. Process Original (Strip EXIF, keep resolution) -> "original"
        // Note: We deliberately re-process the original to strip EXIF and ensure clean encoding
        byte[] originalStripped = imageProcessingPort.process(command.getImageBytes(), 0, originalMeta.getMimeType());
        String originalKey = String.format("images/%s/original.%s", uploadIdStr, getExtension(originalMeta.getMimeType()));
        String originalUrl = imageStoragePort.upload(originalKey, originalStripped, originalMeta.getMimeType());
        uploadedUrls.put("original", originalUrl);

        // B. Process Variants (Large, Medium, Thumb)
        RESIZE_TARGETS.forEach((variantName, width) -> {
            if (originalMeta.getWidth() > width) {
                byte[] resized = imageProcessingPort.process(command.getImageBytes(), width, originalMeta.getMimeType());
                String key = String.format("images/%s/%s.%s", uploadIdStr, variantName, getExtension(originalMeta.getMimeType()));
                String url = imageStoragePort.upload(key, resized, originalMeta.getMimeType());
                uploadedUrls.put(variantName, url);
            } else {
                // If image is smaller than target, use original (stripped) as variant
                uploadedUrls.put(variantName, originalUrl);
            }
        });

        // 6. Construct Result
        String primaryUrl = uploadedUrls.getOrDefault("large", originalUrl);

        return UploadImageResult.builder()
                .uploadId(uploadIdStr)
                .urls(uploadedUrls)
                .primaryUrl(primaryUrl)
                .meta(UploadImageResult.ImageMetaResult.builder()
                        .mimeType(originalMeta.getMimeType())
                        .sizeBytes(command.getImageBytes().length)
                        .width(originalMeta.getWidth())
                        .height(originalMeta.getHeight())
                        .build())
                .build();
    }

    private void validateImageSignature(byte[] data) {
        if (data == null || data.length < 12) {
            throw new CommunityException(CommunityErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }

        // JPEG: FF D8 FF
        if (data[0] == (byte) 0xFF && data[1] == (byte) 0xD8 && data[2] == (byte) 0xFF) {
            return;
        }
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (data[0] == (byte) 0x89 && data[1] == (byte) 0x50 && data[2] == (byte) 0x4E &&
            data[3] == (byte) 0x47 && data[4] == (byte) 0x0D && data[5] == (byte) 0x0A &&
            data[6] == (byte) 0x1A && data[7] == (byte) 0x0A) {
            return;
        }
        // WEBP: RIFF ... WEBP
        // 'R' 'I' 'F' 'F' (0-3) ... 'W' 'E' 'B' 'P' (8-11)
        if (data[0] == (byte) 'R' && data[1] == (byte) 'I' && data[2] == (byte) 'F' && data[3] == (byte) 'F' &&
            data[8] == (byte) 'W' && data[9] == (byte) 'E' && data[10] == (byte) 'B' && data[11] == (byte) 'P') {
            return;
        }

        throw new CommunityException(CommunityErrorCode.UNSUPPORTED_MEDIA_TYPE);
    }

    private String getExtension(String mimeType) {
        return switch (mimeType) {
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            default -> "jpg";
        };
    }
}
