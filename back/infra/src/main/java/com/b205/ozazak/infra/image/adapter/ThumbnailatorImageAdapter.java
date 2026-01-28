package com.b205.ozazak.infra.image.adapter;

import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.image.port.out.ImageMetadataPort;
import com.b205.ozazak.application.image.port.out.ImageProcessingPort;
import com.b205.ozazak.application.image.port.out.dto.ImageMeta;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class ThumbnailatorImageAdapter implements ImageProcessingPort, ImageMetadataPort {

    @Override
    public ImageMeta extract(byte[] imageBytes) {
        try (ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes)) {
            BufferedImage image = ImageIO.read(bis);
            if (image == null) {
                throw new CommunityException(CommunityErrorCode.UNSUPPORTED_MEDIA_TYPE);
            }
            // MimeType isn't easily extracted by ImageIO, but Service already validates signature.
            // We can return a generic type or derived from checking format again if needed.
            // For now, allow service to pass mimeType logic or use Tika if strictly required.
            // But Service has mimeType from signature check for internal logic. 
            // Here we mainly need W/H.
            return ImageMeta.builder()
                    .width(image.getWidth())
                    .height(image.getHeight())
                    .mimeType("image/jpeg") // Placeholder, service overrides or we detect via signature in port if improved
                    .build();
        } catch (IOException e) {
            throw new CommunityException(CommunityErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }
    }

    @Override
    public byte[] process(byte[] imageBytes, int targetWidth, String mimeType) {
        try (ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {

            BufferedImage originalImage = ImageIO.read(bis);
            if (originalImage == null) {
                throw new CommunityException(CommunityErrorCode.IMAGE_PROCESSING_ERROR);
            }

            // Calculate scaling
            double scale = 1.0;
            if (targetWidth > 0 && originalImage.getWidth() > targetWidth) {
                scale = (double) targetWidth / originalImage.getWidth();
            }

            // Thumbnailator builder
            // outputQuality(0.9) for reasonable compression
            Thumbnails.of(originalImage)
                    .scale(scale)
                    .outputFormat(getExtension(mimeType))
                    .outputQuality(0.9)
                    .toOutputStream(bos);
                    // Thumbnailator removes metadata by default unless .keepAspectRatio(true) is mostly layout related
                    // but metadata stripping is implicit in re-encoding to stream without copying metadata

            return bos.toByteArray();
        } catch (IOException e) {
            throw new CommunityException(CommunityErrorCode.IMAGE_PROCESSING_ERROR);
        }
    }

    private String getExtension(String mimeType) {
        if ("image/png".equals(mimeType)) return "png";
        if ("image/webp".equals(mimeType)) return "webp";
        return "jpg";
    }
}
