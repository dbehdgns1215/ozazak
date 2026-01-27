package com.b205.ozazak.application.coverletter.service;

import com.b205.ozazak.application.coverletter.command.GetCoverletterListCommand;
import com.b205.ozazak.application.coverletter.port.in.GetCoverletterListUseCase;
import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
import com.b205.ozazak.application.coverletter.result.CoverletterListResult;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetCoverletterListService implements GetCoverletterListUseCase {

    private final LoadCoverletterPort loadCoverletterPort;

    @Override
    public CoverletterListResponse execute(GetCoverletterListCommand command) {
        Long accountId = command.getAccountId();
        int page = command.getPage();
        int size = command.getSize();
        
        Pageable pageable = PageRequest.of(
            page, 
            size, 
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        
        Page<com.b205.ozazak.domain.coverletter.entity.Coverletter> coverletterPage = 
                loadCoverletterPort.findByAccountId(accountId, pageable);
        
        List<CoverletterListResult> items = coverletterPage.getContent().stream()
                .map(CoverletterListResult::from)
                .collect(Collectors.toList());
        
        return new CoverletterListResponseImpl(
                items,
                new PageInfoImpl(
                        coverletterPage.getNumber(),
                        coverletterPage.getTotalPages(),
                        coverletterPage.getTotalElements(),
                        coverletterPage.hasNext()
                )
        );
    }
    
    @Getter
    @RequiredArgsConstructor
    private static class CoverletterListResponseImpl implements CoverletterListResponse {
        private final List<CoverletterListResult> items;
        private final PageInfo pageInfo;
    }
    
    @Getter
    @RequiredArgsConstructor
    private static class PageInfoImpl implements PageInfo {
        private final int currentPage;
        private final int totalPages;
        private final long totalElements;
        private final boolean hasNext;
    }
}
