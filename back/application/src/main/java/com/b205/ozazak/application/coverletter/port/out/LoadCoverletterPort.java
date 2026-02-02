package com.b205.ozazak.application.coverletter.port.out;

import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface LoadCoverletterPort {
    Page<Coverletter> findByAccountId(Long accountId, Pageable pageable);
    Optional<Coverletter> findByIdAndAccountId(Long coverletterId, Long accountId);
    Optional<Coverletter> findByAccountIdAndRecruitmentId(Long accountId, Long recruitmentId);
    Optional<Coverletter> findById(Long coverletterId);
}
