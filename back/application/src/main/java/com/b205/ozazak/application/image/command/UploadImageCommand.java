package com.b205.ozazak.application.image.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UploadImageCommand {
    private final Long uploaderId;
    private final byte[] imageBytes;
    private final long sizeBytes;
    private final String contentType;
}
