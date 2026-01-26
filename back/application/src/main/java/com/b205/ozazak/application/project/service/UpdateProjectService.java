package com.b205.ozazak.application.project.service;

import com.b205.ozazak.application.project.port.out.LoadProjectPort;
import com.b205.ozazak.application.project.result.GetProjectResult;
import com.b205.ozazak.application.project.command.UpdateProjectCommand;
import com.b205.ozazak.application.project.port.in.UpdateProjectUseCase;
import com.b205.ozazak.application.project.port.out.SaveProjectPort;
import com.b205.ozazak.domain.project.entity.Project;
import com.b205.ozazak.domain.project.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateProjectService implements UpdateProjectUseCase {

    private final LoadProjectPort loadProjectPort;
    private final SaveProjectPort saveProjectPort;

    @Override
    public GetProjectResult updateProject(Long projectId, UpdateProjectCommand command) {
        Project existing = loadProjectPort.loadProject(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        Project updated = Project.builder()
                .projectId(existing.getProjectId())
                .author(existing.getAuthor())
                .title(new ProjectTitle(command.getTitle()))
                .content(new ProjectContent(command.getContent()))
                .image(command.getImage() != null ? new ProjectImage(command.getImage()) : null)
                .startedAt(new StartedAt(command.getStartedAt()))
                .endedAt(command.getEndedAt() != null ? new EndedAt(command.getEndedAt()) : null)
                .createdAt(existing.getCreatedAt())
                .updatedAt(new UpdatedAt(LocalDateTime.now()))
                .tags(command.getTags())
                .build();

        // 검사 내용들
        updated.validateDateRange();

        Project saved = saveProjectPort.saveProject(updated);

        return GetProjectResult.from(saved);
    }
}
