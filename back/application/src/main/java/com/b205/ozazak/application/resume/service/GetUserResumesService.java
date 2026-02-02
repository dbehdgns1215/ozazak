package com.b205.ozazak.application.resume.service;

import com.b205.ozazak.application.resume.port.ResumePersistencePort;
import com.b205.ozazak.application.resume.read.GetUserResumesResult;
import com.b205.ozazak.application.resume.result.ResumeDataDto;
import com.b205.ozazak.domain.resume.entity.Resume;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetUserResumesService {
    private final ResumePersistencePort resumePersistencePort;

    public GetUserResumesResult getUserResumes(Long userId) {
        // 1. 사용자의 모든 이력 조회 (startedAt 기준 최신순)
        List<Resume> resumes = resumePersistencePort.findByAccountId(userId);

        // 2. Domain -> Result DTO 변환
        List<ResumeDataDto> resumeDtos = resumes.stream()
            .map(resume -> new ResumeDataDto(
                resume.getId().value(),
                resume.getTitle().value(),
                resume.getContent().value(),
                resume.getStartedAt().value(),
                resume.getEndedAt() != null ? resume.getEndedAt().value() : null
            ))
            .toList();

        // 3. 결과 반환
        return new GetUserResumesResult(userId, resumeDtos);
    }
}
