package com.b205.ozazak.application.bookmark.port.in;

public interface AddBookmarkUseCase {
    void registerBookmark(Long accountId, Long recruitmentId);
}
