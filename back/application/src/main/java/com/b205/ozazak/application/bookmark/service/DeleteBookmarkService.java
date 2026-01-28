package com.b205.ozazak.application.bookmark.service;

import com.b205.ozazak.application.bookmark.port.in.DeleteBookmarkUseCase;
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
public class DeleteBookmarkService implements DeleteBookmarkUseCase {

    private final SaveBookmarkPort manageBookmarkPort;
    private final LoadBookmarkPort loadBookmarkPort;

    @Override
    public void deleteBookmark(Long accountId, Long recruitmentId) {
        // 북마크 되어있지 않은 경우 확인
        if (!loadBookmarkPort.isBookmarked(accountId, recruitmentId)) {
            log.info("Bookmark not found, cannot remove: accountId={}, recruitmentId={}", accountId, recruitmentId);
            return;
        }

        // 북마크 삭제
        manageBookmarkPort.removeBookmark(accountId, recruitmentId);
    }
}
