package com.b205.ozazak.application.resume.service;

import com.b205.ozazak.application.resume.delete.DeleteResumeCommand;
import com.b205.ozazak.application.resume.delete.DeleteResumeResult;
import com.b205.ozazak.domain.resume.entity.Resume;
import com.b205.ozazak.application.resume.port.ResumePersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class DeleteResumeService {
    private final ResumePersistencePort resumePersistencePort;

    public DeleteResumeResult deleteResume(DeleteResumeCommand command) {
        // 1. Resume 조회
        Resume resume = resumePersistencePort.findById(command.resumeId())
            .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        // 2. 권한 검증 (userId == resume.account.id)
        if (!resume.getAccount().getId().value().equals(command.accountId())) {
            throw new IllegalStateException("Unauthorized to delete this resume");
        }

        // 3. 삭제
        resumePersistencePort.deleteById(command.resumeId());

        // 4. userId 반환 (마이페이지 리다이렉트용)
        return new DeleteResumeResult(resume.getAccount().getId().value());
    }
}
