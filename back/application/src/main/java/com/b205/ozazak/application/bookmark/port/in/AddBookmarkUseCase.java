package com.b205.ozazak.application.bookmark.port.in;

import com.b205.ozazak.application.bookmark.command.AddBookmarkCommand;

public interface AddBookmarkUseCase {
    void addBookmark(AddBookmarkCommand command);
}
