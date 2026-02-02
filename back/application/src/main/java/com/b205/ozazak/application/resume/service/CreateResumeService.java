package com.b205.ozazak.application.resume.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.resume.command.CreateResumeCommand;
import com.b205.ozazak.application.resume.port.ResumePersistencePort;
import com.b205.ozazak.application.resume.result.CreateResumeResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.resume.entity.Resume;
import com.b205.ozazak.domain.resume.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateResumeService {
    private final AccountPersistencePort accountPersistencePort;
    private final ResumePersistencePort resumePersistencePort;

    public CreateResumeResult createResume(CreateResumeCommand command) {
        // 1. Account 조회
        Account account = accountPersistencePort.findById(command.accountId())
            .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // 2. 날짜 유효성 검증 (endedAt >= startedAt)
        if (command.endedAt() != null && command.endedAt().isBefore(command.startedAt())) {
            throw new IllegalArgumentException("Ended date cannot be before started date");
        }

        // 3. Domain Entity 생성 (VO 생성 시 자동으로 validation 적용됨)
        Resume resume = Resume.builder()
            .account(account)
            .title(new ResumeTitle(command.title()))
            .content(new ResumeContent(command.content()))
            .startedAt(new StartedAt(command.startedAt()))
            .endedAt(command.endedAt() != null ? new EndedAt(command.endedAt()) : null)
            .build();

        // 4. 저장
        Resume savedResume = resumePersistencePort.save(resume);

        // 5. userId 반환 (마이페이지 조회용)
        return new CreateResumeResult(account.getId().value());
    }
}
