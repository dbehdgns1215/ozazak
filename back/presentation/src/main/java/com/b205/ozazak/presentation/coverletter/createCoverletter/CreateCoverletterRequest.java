package com.b205.ozazak.presentation.coverletter.createCoverletter;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor  // Jackson deserialization
public class CreateCoverletterRequest {
    
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 100, message = "제목은 100자를 초과할 수 없습니다")
    private String title;
    
    // recruitmentId는 optional (모집 끝난 공고일 수 있음)
    private Long recruitmentId;
    
    @NotEmpty(message = "최소 1개의 에세이가 필요합니다")
    @Valid  // Nested validation
    private List<EssayRequest> essays;
    
    @Getter
    @NoArgsConstructor
    public static class EssayRequest {
        @NotBlank(message = "질문은 필수입니다")
        private String question;
        
        @NotBlank(message = "내용은 필수입니다")
        private String content;
        
        @NotNull(message = "글자 수 제한은 필수입니다")
        @Min(value = 1, message = "글자 수는 1 이상이어야 합니다")
        private Integer charMax;
    }
}
