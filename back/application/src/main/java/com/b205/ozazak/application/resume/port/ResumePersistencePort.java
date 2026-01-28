package com.b205.ozazak.application.resume.port;

import com.b205.ozazak.domain.resume.entity.Resume;

import java.util.List;
import java.util.Optional;

public interface ResumePersistencePort {
    Resume save(Resume resume);
    
    List<Resume> findByAccountId(Long accountId);
    
    Optional<Resume> findById(Long resumeId);
    
    void deleteById(Long resumeId);
}
