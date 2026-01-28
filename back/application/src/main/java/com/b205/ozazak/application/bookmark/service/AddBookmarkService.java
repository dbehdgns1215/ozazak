package com.b205.ozazak.application.bookmark.service;

import com.b205.ozazak.application.bookmark.port.in.AddBookmarkUseCase;
import com.b205.ozazak.application.bookmark.port.out.SaveBookmarkPort;
import com.b205.ozazak.application.recruitment.port.out.LoadBookmarkPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AddBookmarkService implements AddBookmarkUseCase {

    private final SaveBookmarkPort manageBookmarkPort;
    private final LoadBookmarkPort loadBookmarkPort;

    @Override
    public void registerBookmark(Long accountId, Long recruitmentId) {
        // 이미 북마크 되어있는지 확인
        if (loadBookmarkPort.isBookmarked(accountId, recruitmentId)) {
            log.info("Already bookmarked: accountId={}, recruitmentId={}", accountId, recruitmentId);
            return;
        }

        // 북마크 저장
        manageBookmarkPort.saveBookmark(accountId, recruitmentId);
    }
}
