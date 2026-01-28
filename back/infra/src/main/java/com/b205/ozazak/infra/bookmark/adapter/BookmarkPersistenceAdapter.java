package com.b205.ozazak.infra.bookmark.adapter;

import com.b205.ozazak.application.bookmark.port.out.SaveBookmarkPort;
import com.b205.ozazak.application.recruitment.port.out.LoadBookmarkPort;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.bookmark.entity.BookmarkJpaEntity;
import com.b205.ozazak.infra.bookmark.repository.BookmarkJpaRepository;
import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import com.b205.ozazak.infra.recruitment.repository.RecruitmentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class BookmarkPersistenceAdapter implements LoadBookmarkPort, SaveBookmarkPort {

    private final BookmarkJpaRepository bookmarkJpaRepository;
    private final AccountJpaRepository accountJpaRepository;
    private final RecruitmentJpaRepository recruitmentJpaRepository;

    @Override
    public Set<Long> loadBookmarkedRecruitmentIds(Long accountId) {
        return bookmarkJpaRepository.findRecruitmentIdsByAccountId(accountId);
    }

    @Override
    public boolean isBookmarked(Long accountId, Long recruitmentId) {
        return bookmarkJpaRepository.existsByAccountIdAndRecruitmentId(accountId, recruitmentId);
    }

    @Override
    public void saveBookmark(Long accountId, Long recruitmentId) {
        AccountJpaEntity account = accountJpaRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + accountId));
        RecruitmentJpaEntity recruitment = recruitmentJpaRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("Recruitment not found: " + recruitmentId));

        bookmarkJpaRepository.save(BookmarkJpaEntity.create(account, recruitment));
    }
}
