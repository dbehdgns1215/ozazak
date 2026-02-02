package com.b205.ozazak.presentation.essay.deleteEssay;

import com.b205.ozazak.application.essay.result.DeleteEssayResult;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteEssayResponse {
    private final Data data;
    
    @Getter
    @Builder
    public static class Data {
        private final Long deletedEssayId;
    }
    
    public static DeleteEssayResponse from(DeleteEssayResult result) {
        return DeleteEssayResponse.builder()
                .data(Data.builder()
                        .deletedEssayId(result.getDeletedEssayId())
                        .build())
                .build();
    }
}
