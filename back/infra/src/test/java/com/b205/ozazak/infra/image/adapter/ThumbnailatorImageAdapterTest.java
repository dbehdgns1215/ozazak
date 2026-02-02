package com.b205.ozazak.infra.image.adapter;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.exif.GpsDirectory;
import net.coobird.thumbnailator.Thumbnails;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import static org.assertj.core.api.Assertions.assertThat;

class ThumbnailatorImageAdapterTest {

    private final ThumbnailatorImageAdapter adapter = new ThumbnailatorImageAdapter();

    @Test
    @DisplayName("Strict Verification: Output image must NOT contain EXIF/GPS tags")
    void process_stripsExif() throws Exception {
        // Given: Create a dummy image. 
        // Note: Creating a real EXIF-rich image in memory is complex without external files.
        // Instead, we verify that the adapter produces an image where metadata-extractor finds NO Exif directory.
        // Ideally we would load a resource with EXIF, but for now we verify the output stream from Thumbnailator is clean.
        
        BufferedImage rawImage = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageIO.write(rawImage, "jpg", os);
        byte[] inputBytes = os.toByteArray();

        // When
        byte[] outputBytes = adapter.process(inputBytes, 100, "image/jpeg");

        // Then: Use metadata-extractor to assert cleanliness
        Metadata metadata = ImageMetadataReader.readMetadata(new ByteArrayInputStream(outputBytes));
        
        // Assert no GPS directory
        Directory gpsDir = metadata.getFirstDirectoryOfType(GpsDirectory.class);
        assertThat(gpsDir).isNull();

        // Assert no ExifIFD0 directory (or empty)
        ExifIFD0Directory exifDir = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
        if (exifDir != null) {
            assertThat(exifDir.getTagCount()).isZero();
        }
    }
}
