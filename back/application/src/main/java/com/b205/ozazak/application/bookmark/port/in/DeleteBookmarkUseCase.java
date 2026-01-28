package com.b205.ozazak.application.bookmark.port.in;

import com.b205.ozazak.application.bookmark.command.DeleteBookmarkCommand;

public interface DeleteBookmarkUseCase {
    void deleteBookmark(DeleteBookmarkCommand command);
}
