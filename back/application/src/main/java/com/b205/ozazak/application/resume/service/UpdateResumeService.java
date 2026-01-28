package com.b205.ozazak.application.resume.service;

import com.b205.ozazak.application.resume.update.UpdateResumeCommand;
import com.b205.ozazak.application.resume.update.UpdateResumeResult;
import com.b205.ozazak.domain.resume.entity.Resume;
import com.b205.ozazak.application.resume.port.ResumePersistencePort;
import com.b205.ozazak.domain.resume.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateResumeService {
    private final ResumePersistencePort resumePersistencePort;

    public UpdateResumeResult updateResume(UpdateResumeCommand command) {
        // 1. Resume 조회
        Resume resume = resumePersistencePort.findById(command.resumeId())
            .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        // 2. 권한 검증 (userId == resume.account.id)
        if (!resume.getAccount().getId().value().equals(command.accountId())) {
            throw new IllegalStateException("Unauthorized to update this resume");
        }

        // 3. 날짜 유효성 검증
        if (command.endedAt() != null && command.endedAt().isBefore(command.startedAt())) {
            throw new IllegalArgumentException("Ended date cannot be before started date");
        }

        // 4. Domain Entity 업데이트 (immutable 유지)
        Resume updatedResume = resume.update(
            new ResumeTitle(command.title()),
            new ResumeContent(command.content()),
            new StartedAt(command.startedAt()),
            command.endedAt() != null ? new EndedAt(command.endedAt()) : null
        );

        // 5. 저장
        resumePersistencePort.save(updatedResume);

        // 6. recordId 반환
        return new UpdateResumeResult(resume.getId().value());
    }
}
