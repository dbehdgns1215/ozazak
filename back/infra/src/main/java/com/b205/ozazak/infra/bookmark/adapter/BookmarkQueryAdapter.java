package com.b205.ozazak.infra.bookmark.adapter;

import com.b205.ozazak.application.recruitment.port.out.LoadBookmarkPort;
import com.b205.ozazak.infra.bookmark.repository.BookmarkJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class BookmarkQueryAdapter implements LoadBookmarkPort {

    private final BookmarkJpaRepository bookmarkJpaRepository;

    @Override
    public Set<Long> loadBookmarkedRecruitmentIds(Long accountId) {
        return bookmarkJpaRepository.findRecruitmentIdsByAccountId(accountId);
    }

    @Override
    public boolean isBookmarked(Long accountId, Long recruitmentId) {
        return bookmarkJpaRepository.existsByAccountIdAndRecruitmentId(accountId, recruitmentId);
    }
}
