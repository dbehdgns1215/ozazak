package com.b205.ozazak.presentation.project.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {

    }
}
