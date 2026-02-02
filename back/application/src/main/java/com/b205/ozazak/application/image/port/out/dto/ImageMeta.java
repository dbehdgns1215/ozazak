package com.b205.ozazak.application.image.port.out.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImageMeta {
    private final String mimeType;
    private final int width;
    private final int height;
}
