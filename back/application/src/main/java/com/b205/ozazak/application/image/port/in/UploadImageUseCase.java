package com.b205.ozazak.application.image.port.in;

import com.b205.ozazak.application.image.command.UploadImageCommand;
import com.b205.ozazak.application.image.result.UploadImageResult;

public interface UploadImageUseCase {
    UploadImageResult upload(UploadImageCommand command);
}
