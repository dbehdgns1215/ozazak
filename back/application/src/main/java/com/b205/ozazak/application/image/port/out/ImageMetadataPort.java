package com.b205.ozazak.application.image.port.out;

import com.b205.ozazak.application.image.port.out.dto.ImageMeta;

public interface ImageMetadataPort {
    ImageMeta extract(byte[] imageBytes);
}
