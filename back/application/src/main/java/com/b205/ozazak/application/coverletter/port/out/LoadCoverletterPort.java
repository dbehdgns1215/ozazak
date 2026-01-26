package com.b205.ozazak.application.coverletter.port.out;

import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoadCoverletterPort {
    Page<Coverletter> findByAccountId(Long accountId, Pageable pageable);
}
