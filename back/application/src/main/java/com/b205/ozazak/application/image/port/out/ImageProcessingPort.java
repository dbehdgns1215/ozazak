package com.b205.ozazak.application.image.port.out;

public interface ImageProcessingPort {
    /**
     * Resizes the image to the target width while maintaining aspect ratio,
     * strips EXIF metadata, and re-encodes the image.
     * @param imageBytes raw image bytes
     * @param targetWidth target width (use 0/negative for original width, but re-encoded)
     * @param mimeType target mime type
     * @return processed image bytes
     */
    byte[] process(byte[] imageBytes, int targetWidth, String mimeType);
}
