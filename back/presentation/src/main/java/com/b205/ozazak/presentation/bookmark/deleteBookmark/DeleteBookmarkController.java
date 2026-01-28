package com.b205.ozazak.presentation.bookmark.deleteBookmark;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.bookmark.port.in.DeleteBookmarkUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b205.ozazak.application.bookmark.command.DeleteBookmarkCommand;

@RestController
@RequestMapping("/api/recruitments/{recruitmentId}/bookmark")
@RequiredArgsConstructor
@Tag(name = "Recruitment", description = "Recruitment API")
public class DeleteBookmarkController {

    private final DeleteBookmarkUseCase deleteBookmarkUseCase;

    @Operation(summary = "Remove Bookmark", description = "공고 북마크 해제")
    @DeleteMapping
    public ResponseEntity<Void> deleteBookmark(
            @PathVariable(name = "recruitmentId") Long recruitmentId,
            @AuthenticationPrincipal CustomPrincipal principal) {
        deleteBookmarkUseCase.deleteBookmark(
                DeleteBookmarkCommand.builder()
                        .accountId(principal.getAccountId())
                        .recruitmentId(recruitmentId)
                        .build());
        return ResponseEntity.ok().build();
    }
}
