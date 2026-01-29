package com.b205.ozazak.application.project.service;

import com.b205.ozazak.application.project.port.out.LoadProjectPort;
import com.b205.ozazak.application.project.result.GetProjectResult;
import com.b205.ozazak.application.project.command.UpdateProjectCommand;
import com.b205.ozazak.application.project.port.in.UpdateProjectUseCase;
import com.b205.ozazak.application.project.port.out.SaveProjectPort;
import com.b205.ozazak.domain.project.entity.Project;
import com.b205.ozazak.domain.project.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
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
    public GetProjectResult updateProject(Long userId, Long projectId, UpdateProjectCommand command) {
        Project existing = loadProjectPort.loadProject(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        if (!existing.getAuthor().getId().value().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to update this project");
        }

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
