package com.b205.ozazak.presentation.bookmark.addBookmark;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.bookmark.port.in.AddBookmarkUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b205.ozazak.application.bookmark.command.AddBookmarkCommand;

@RestController
@RequestMapping("/api/recruitments/{recruitmentId}/bookmark")
@RequiredArgsConstructor
@Tag(name = "Recruitment", description = "Recruitment API")
public class AddBookmarkController {

    private final AddBookmarkUseCase addBookmarkUseCase;

    @Operation(summary = "Register Bookmark", description = "공고 북마크 등록")
    @PostMapping
    public ResponseEntity<Void> addBookmark(
            @PathVariable(name = "recruitmentId") Long recruitmentId,
            @AuthenticationPrincipal CustomPrincipal principal) {
        addBookmarkUseCase.addBookmark(
                AddBookmarkCommand.builder()
                        .accountId(principal.getAccountId())
                        .recruitmentId(recruitmentId)
                        .build());
        return ResponseEntity.ok().build();
    }
}
