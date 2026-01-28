package com.b205.ozazak.application.recruitment.service;

import com.b205.ozazak.application.question.port.out.LoadQuestionPort;
import com.b205.ozazak.application.recruitment.port.in.GetRecruitmentUseCase;
import com.b205.ozazak.application.recruitment.port.out.LoadBookmarkPort;
import com.b205.ozazak.application.recruitment.port.out.LoadRecruitmentListPort;
import com.b205.ozazak.application.recruitment.port.out.LoadRecruitmentPort;
import com.b205.ozazak.application.recruitment.result.GetRecruitmentListResult;
import com.b205.ozazak.application.recruitment.result.GetRecruitmentResult;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetRecruitmentService implements GetRecruitmentUseCase {

    private final LoadRecruitmentListPort loadRecruitmentListPort;
    private final LoadRecruitmentPort loadRecruitmentPort;
    private final LoadBookmarkPort loadBookmarkPort;
    private final LoadQuestionPort loadQuestionPort;

    @Override
    public List<GetRecruitmentListResult> getRecruitmentList(Long accountId, Integer year, Integer month) {
        // 조회 기간 계산
        if (year == null || month == null) {
            LocalDate now = LocalDate.now();
            year = now.getYear();
            month = now.getMonthValue();
        }
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate fromDate = yearMonth.atDay(1);
        LocalDate toDate = yearMonth.atEndOfMonth();

        // 공고 목록 조회 (기간별)
        List<Recruitment> recruitments = loadRecruitmentListPort.loadRecruitmentList(fromDate, toDate);

        // 사용자가 로그인한 경우, 북마크 정보 조회
        Set<Long> bookmarkedIds;
        if (accountId != null) {
            bookmarkedIds = loadBookmarkPort.loadBookmarkedRecruitmentIds(accountId);
        } else {
            bookmarkedIds = Collections.emptySet();
        }

        final Set<Long> finalBookmarkedIds = bookmarkedIds;
        return recruitments.stream()
                .map(recruitment -> GetRecruitmentListResult.from(
                        recruitment,
                        finalBookmarkedIds.contains(recruitment.getId().value())))
                .collect(Collectors.toList());
    }

    @Override
    public GetRecruitmentResult getRecruitment(Long recruitmentId, Long accountId) {
        // 공고 상세 조회
        Recruitment recruitment = loadRecruitmentPort.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("Recruitment not found: " + recruitmentId));

        // 자소서 문항
        List<Question> questions = loadQuestionPort.findAllByRecruitmentId(recruitmentId);

        // 북마크 여부 확인
        boolean isBookmarked = false;
        if (accountId != null) {
            isBookmarked = loadBookmarkPort.isBookmarked(accountId, recruitmentId);
        }

        return GetRecruitmentResult.from(recruitment, questions, isBookmarked);
    }
}
