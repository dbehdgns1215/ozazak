package com.b205.ozazak.application.coverletter.port.in;

import com.b205.ozazak.application.coverletter.result.CoverletterListResult;

import java.util.List;

public interface GetCoverletterListUseCase {
    CoverletterListResponse getCoverletterList(Long accountId, int page, int size);
    
    // Nested response type to avoid Spring Data Page in presentation
    interface CoverletterListResponse {
        List<CoverletterListResult> getItems();
        PageInfo getPageInfo();
    }
    
    interface PageInfo {
        int getCurrentPage();
        int getTotalPages();
        long getTotalElements();
        boolean isHasNext();
    }
}
