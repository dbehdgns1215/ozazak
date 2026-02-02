package com.b205.ozazak.application.project.port.out;

import com.b205.ozazak.domain.project.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoadProjectListPort {
    Page<Project> loadProjectSummaries(Long accountId, Pageable pageable);
}
