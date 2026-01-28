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

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
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
        // 조회 기간 계산 (기본값 - 오늘 연/월)
        if (year == null || month == null) {
            LocalDate now = LocalDate.now();
            year = now.getYear();
            month = now.getMonthValue();
        }
        YearMonth yearMonth = YearMonth.of(year, month);

        // 해당 월의 1일이 포함된 주의 일요일부터 시작
        LocalDate fromDate = yearMonth.atDay(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));

        // 해당 월의 마지막 날이 포함된 주의 토요일까지 종료
        LocalDate toDate = yearMonth.atEndOfMonth().with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));

        // 공고 목록 조회
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
    public List<GetRecruitmentListResult> getClosingRecruitmentList(Long accountId, Integer days) {
        // 조회 기간 계산
        if (days == null) {
            days = 5;
        }
        LocalDate fromDate = LocalDate.now();
        LocalDate toDate = fromDate.plusDays(days);

        // 마감 임박 공고 조회
        List<Recruitment> recruitments = loadRecruitmentListPort.loadClosingRecruitments(fromDate, toDate);

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
        Recruitment recruitment = loadRecruitmentPort.loadRecruitment(recruitmentId)
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

    @Override
    public List<GetRecruitmentListResult> getBookmarkedRecruitmentList(Long accountId) {
        // 북마크한 공고 조회
        List<Recruitment> recruitments = loadRecruitmentListPort.loadBookmarkedRecruitmentList(accountId);

        return recruitments.stream()
                .map(recruitment -> GetRecruitmentListResult.from(recruitment, true))
                .collect(Collectors.toList());
    }
}
