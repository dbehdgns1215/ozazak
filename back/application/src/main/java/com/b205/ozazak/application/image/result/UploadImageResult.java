package com.b205.ozazak.application.image.result;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class UploadImageResult {
    private final String uploadId;
    private final Map<String, String> urls;
    private final String primaryUrl;
    private final ImageMetaResult meta;

    @Getter
    @Builder
    public static class ImageMetaResult {
        private final String mimeType;
        private final long sizeBytes;
        private final int width;
        private final int height;
    }
}
