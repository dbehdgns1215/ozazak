package com.b205.ozazak.application.project.service;

import com.b205.ozazak.application.project.port.in.DeleteProjectUseCase;
import com.b205.ozazak.application.project.port.out.LoadProjectPort;
import com.b205.ozazak.application.project.port.out.SaveProjectPort;
import com.b205.ozazak.domain.project.entity.Project;
import com.b205.ozazak.domain.project.vo.DeletedAt;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class DeleteProjectService implements DeleteProjectUseCase {

    private final LoadProjectPort loadProjectPort;
    private final SaveProjectPort saveProjectPort;

    @Override
    public void deleteProject(Long userId, Long projectId) {
        Project project = loadProjectPort.loadProject(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        if (!project.getAuthor().getId().value().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to delete this project");
        }

        // soft delete
        Project deleted = Project.builder()
                .projectId(project.getProjectId())
                .author(project.getAuthor())
                .title(project.getTitle())
                .content(project.getContent())
                .image(project.getImage())
                .startedAt(project.getStartedAt())
                .endedAt(project.getEndedAt())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .deletedAt(new DeletedAt(LocalDateTime.now()))
                .tags(project.getTags())
                .build();

        saveProjectPort.saveProject(deleted);
    }
}
