package com.b205.ozazak.presentation.image;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.image.command.UploadImageCommand;
import com.b205.ozazak.application.image.port.in.UploadImageUseCase;
import com.b205.ozazak.application.image.result.UploadImageResult;
import com.b205.ozazak.presentation.community.CommunityControllerTestBase;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;


@WebMvcTest(controllers = ImageUploadController.class)
class ImageUploadControllerTest extends CommunityControllerTestBase {

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UploadImageUseCase uploadImageUseCase;

    @Test
    @DisplayName("Success: upload valid image returns 201")
    void upload_success() throws Exception {
        String token = "valid-token";
        CustomPrincipal principal = createUserPrincipal(100L, "test@test.com");
        given(tokenProviderPort.parseToken(token)).willReturn(Optional.of(principal));

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                new byte[]{1, 2, 3}
        );

        UploadImageResult result = UploadImageResult.builder()
                .uploadId("uuid-1234")
                .primaryUrl("http://s3/test.jpg")
                .urls(Map.of("original", "http://s3/test.jpg"))
                .meta(UploadImageResult.ImageMetaResult.builder().width(100).height(100).build())
                .build();

        given(uploadImageUseCase.upload(any(UploadImageCommand.class))).willReturn(result);

        mockMvc.perform(multipart("/api/image")
                        .file(file)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.uploadId").value("uuid-1234"));
    }

    @Test
    @DisplayName("Failure: 401 if unauthenticated")
    void upload_unauthenticated_returns401() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", new byte[]{1}
        );

        mockMvc.perform(multipart("/api/image").file(file))
                .andExpect(status().isUnauthorized());
    }
}
