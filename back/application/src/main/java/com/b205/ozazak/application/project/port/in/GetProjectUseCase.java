package com.b205.ozazak.application.project.port.in;

import com.b205.ozazak.application.project.result.GetProjectResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GetProjectUseCase {
    GetProjectResult getProject(Long userId, Long projectId);

    Page<GetProjectResult> getProjectList(Long accountId, Pageable pageable);
}
