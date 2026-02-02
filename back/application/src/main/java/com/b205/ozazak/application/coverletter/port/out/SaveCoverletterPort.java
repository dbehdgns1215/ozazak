package com.b205.ozazak.application.coverletter.port.out;

import com.b205.ozazak.domain.coverletter.entity.Coverletter;

public interface SaveCoverletterPort {
    Coverletter save(Coverletter coverletter);
}
