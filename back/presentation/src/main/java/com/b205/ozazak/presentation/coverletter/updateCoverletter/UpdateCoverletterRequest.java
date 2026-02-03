package com.b205.ozazak.presentation.coverletter.updateCoverletter;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor // Jackson deserialization
public class UpdateCoverletterRequest {

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    @NotNull(message = "작성 완료 여부는 필수입니다")
    private Boolean isComplete;

    // isPassed can be null (pending state)
    private Boolean isPassed;

    @Valid
    private List<EssayUpdateRequest> essays;

    @Getter
    @NoArgsConstructor
    public static class EssayUpdateRequest {
        @NotNull(message = "Essay ID는 필수입니다")
        private Long id;

        @NotBlank(message = "내용은 필수입니다")
        private String content;
    }
}
