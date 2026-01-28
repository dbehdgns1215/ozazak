package com.b205.ozazak.infra.image.adapter;

import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.image.port.out.ImageStoragePort;
import com.b205.ozazak.infra.image.config.S3Properties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;

@Component
@RequiredArgsConstructor
public class S3ImageStorageAdapter implements ImageStoragePort {

    private final S3Client s3Client;
    private final S3Properties s3Properties;

    @Override
    public String upload(String key, byte[] content, String mimeType) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(key)
                    .contentType(mimeType)
                    // Remove ACL setting since many buckets (including ours likely) enforce "Bucket Owner Enforced" ownership which disables ACLs.
                    // .acl(ObjectCannedACL.PUBLIC_READ) 
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(content));

            // Return S3 URL
            return s3Client.utilities().getUrl(GetUrlRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(key)
                    .build()).toExternalForm();

        } catch (Exception e) {
            throw new CommunityException(CommunityErrorCode.IMAGE_UPLOAD_ERROR);
        }
    }
}
