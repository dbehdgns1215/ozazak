package com.b205.ozazak.application.coverletter.port.in;

import com.b205.ozazak.application.coverletter.result.CoverletterDetailResult;

public interface GetCoverletterDetailUseCase {
    CoverletterDetailResult getCoverletterDetail(Long accountId, Long coverletterId);
}
