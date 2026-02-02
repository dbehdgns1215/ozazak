package com.b205.ozazak.application.streak.port.in;

import com.b205.ozazak.application.streak.dto.AdminUpdateActivityRequest;
import java.time.LocalDate;

public interface StreakAdminUseCase {
    /**
     * [어드민 전용] 특정 사용자의 특정 날짜 활동 수 수정
     * @param accountId 사용자 ID
     * @param activityDate 활동 날짜
     * @param amount 추가할 활동 수 (음수 가능)
     */
    void updateActivityCount(Long accountId, LocalDate activityDate, Integer amount);
}
