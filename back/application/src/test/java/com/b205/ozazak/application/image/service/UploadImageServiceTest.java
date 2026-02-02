package com.b205.ozazak.application.image.service;

import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.image.command.UploadImageCommand;
import com.b205.ozazak.application.image.port.out.ImageMetadataPort;
import com.b205.ozazak.application.image.port.out.ImageProcessingPort;
import com.b205.ozazak.application.image.port.out.ImageStoragePort;
import com.b205.ozazak.application.image.port.out.UploadIdGeneratorPort;
import com.b205.ozazak.application.image.port.out.dto.ImageMeta;
import com.b205.ozazak.application.image.result.UploadImageResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UploadImageServiceTest {

    @Mock
    private UploadIdGeneratorPort uploadIdGeneratorPort;
    @Mock
    private ImageMetadataPort imageMetadataPort;
    @Mock
    private ImageProcessingPort imageProcessingPort;
    @Mock
    private ImageStoragePort imageStoragePort;

    @InjectMocks
    private UploadImageService uploadImageService;

    // Valid JPEG Signature: FF D8 FF
    private static final byte[] VALID_JPEG = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    // Valid PNG Signature
    private static final byte[] VALID_PNG = new byte[]{(byte) 0x89, (byte) 0x50, (byte) 0x4E, (byte) 0x47, (byte) 0x0D, (byte) 0x0A, (byte) 0x1A, (byte) 0x0A, 0, 0, 0, 0};

    @Test
    @DisplayName("Success: upload valid jpeg image")
    void upload_success() {
        // Given
        UUID uuid = UUID.randomUUID();
        given(uploadIdGeneratorPort.generate()).willReturn(uuid);
        
        ImageMeta meta = ImageMeta.builder().width(2000).height(1000).mimeType("image/jpeg").build();
        given(imageMetadataPort.extract(any())).willReturn(meta);

        byte[] processedBytes = new byte[]{1, 2, 3};
        given(imageProcessingPort.process(any(), any(int.class), any())).willReturn(processedBytes);

        given(imageStoragePort.upload(any(), any(), any())).willReturn("https://s3.url/test.jpg");

        UploadImageCommand command = UploadImageCommand.builder()
                .uploaderId(1L)
                .imageBytes(VALID_JPEG)
                .sizeBytes(1000)
                .contentType("image/jpeg")
                .build();

        // When
        UploadImageResult result = uploadImageService.upload(command);

        // Then
        assertThat(result.getUploadId()).isEqualTo(uuid.toString());
        assertThat(result.getUrls()).containsKeys("original", "large", "medium", "thumb");
        
        // Verify processing calls: 1 original + 3 resizes (since width 2000 > all targets)
        verify(imageProcessingPort, times(4)).process(any(), any(int.class), eq("image/jpeg"));
        verify(imageStoragePort, times(4)).upload(any(), any(), eq("image/jpeg"));
    }

    @Test
    @DisplayName("Failure: payload too large throws PAYLOAD_TOO_LARGE")
    void upload_tooLarge_throwsException() {
        // Given
        UploadImageCommand command = UploadImageCommand.builder()
                .sizeBytes(10 * 1024 * 1024 + 1) // 10MB + 1
                .imageBytes(VALID_JPEG)
                .build();

        // When & Then
        assertThatThrownBy(() -> uploadImageService.upload(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.PAYLOAD_TOO_LARGE);
    }

    @Test
    @DisplayName("Failure: invalid signature throws UNSUPPORTED_MEDIA_TYPE")
    void upload_invalidSignature_throwsException() {
        // Given: Empty or Text file bytes
        byte[] invalidBytes = "This is a text file".getBytes();
        
        UploadImageCommand command = UploadImageCommand.builder()
                .sizeBytes(100)
                .imageBytes(invalidBytes)
                .build();

        // When & Then
        assertThatThrownBy(() -> uploadImageService.upload(command))
                .isInstanceOf(CommunityException.class)
                .hasFieldOrPropertyWithValue("errorCode", CommunityErrorCode.UNSUPPORTED_MEDIA_TYPE);
    }
}
