package com.b205.ozazak.application.project.service;

import com.b205.ozazak.application.project.result.GetProjectResult;
import com.b205.ozazak.application.project.port.in.GetProjectUseCase;
import com.b205.ozazak.application.project.port.out.LoadProjectListPort;
import com.b205.ozazak.application.project.port.out.LoadProjectPort;
import com.b205.ozazak.domain.project.entity.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetProjectService implements GetProjectUseCase {

    private final LoadProjectPort loadProjectPort;
    private final LoadProjectListPort loadProjectListPort;

    @Override
    public GetProjectResult getProject(Long projectId) {
        Project project = loadProjectPort.loadProject(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        return GetProjectResult.from(project);
    }

    @Override
    public Page<GetProjectResult> getProjectList(Long accountId, Pageable pageable) {
        return loadProjectListPort.loadProjectSummaries(accountId, pageable)
                .map(GetProjectResult::from);
    }
}
