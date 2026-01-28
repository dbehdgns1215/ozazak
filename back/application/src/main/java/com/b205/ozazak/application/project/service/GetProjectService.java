package com.b205.ozazak.application.project.service;

import com.b205.ozazak.application.project.result.GetProjectResult;
import com.b205.ozazak.application.project.port.in.GetProjectUseCase;
import com.b205.ozazak.application.project.port.out.LoadProjectListPort;
import com.b205.ozazak.application.project.port.out.LoadProjectPort;
import com.b205.ozazak.domain.project.entity.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetProjectService implements GetProjectUseCase {

    private final LoadProjectPort loadProjectPort;
    private final LoadProjectListPort loadProjectListPort;

    @Override
    public GetProjectResult getProject(com.b205.ozazak.application.project.command.GetProjectCommand command) {
        Long projectId = command.getProjectId();
        Long userId = command.getUserId();

        Project project = loadProjectPort.loadProject(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        if (!project.getAuthor().getId().value().equals(userId)) {
            throw new AccessDeniedException("Not authorized");
        }

        return GetProjectResult.from(project);
    }

    @Override
    public Page<GetProjectResult> getProjectList(
            com.b205.ozazak.application.project.command.GetProjectListCommand command) {
        return loadProjectListPort.loadProjectSummaries(command.getAccountId(), command.getPageable())
                .map(GetProjectResult::from);
    }
}
