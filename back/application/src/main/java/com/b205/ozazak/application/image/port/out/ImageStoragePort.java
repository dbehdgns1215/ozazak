package com.b205.ozazak.application.image.port.out;

public interface ImageStoragePort {
    String upload(String key, byte[] content, String mimeType);
}
