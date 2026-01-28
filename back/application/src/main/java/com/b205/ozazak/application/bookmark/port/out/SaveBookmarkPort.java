package com.b205.ozazak.application.bookmark.port.out;

public interface SaveBookmarkPort {
    void saveBookmark(Long accountId, Long recruitmentId);

    void removeBookmark(Long accountId, Long recruitmentId);
}
