package com.b205.ozazak.infra.image.adapter;

import com.b205.ozazak.application.image.port.out.UploadIdGeneratorPort;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UuidGeneratorAdapter implements UploadIdGeneratorPort {
    @Override
    public UUID generate() {
        return UUID.randomUUID();
    }
}
