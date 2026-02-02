package com.b205.ozazak.infra.project.adapter;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.project.port.out.LoadProjectListPort;
import com.b205.ozazak.application.project.port.out.LoadProjectPort;
import com.b205.ozazak.application.project.port.out.SaveProjectPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.project.entity.Project;
import com.b205.ozazak.domain.project.vo.*;
import com.b205.ozazak.infra.project.entity.ProjectJpaEntity;
import com.b205.ozazak.infra.project.repository.ProjectJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ProjectPersistenceAdapter implements LoadProjectPort, LoadProjectListPort, SaveProjectPort {

    private final ProjectJpaRepository projectJpaRepository;
    private final AccountPersistencePort accountPersistencePort;

    @Override
    public Optional<Project> loadProject(Long projectId) {
        return projectJpaRepository.findProjectJpaEntityByProjectId(projectId)
                .map(this::mapToDomain);
    }

    @Override
    public Page<Project> loadProjectSummaries(Long accountId, Pageable pageable) {
        return projectJpaRepository.findProjectJpaEntitiesByAccountId(accountId, pageable)
                .map(this::mapToDomain);
    }

    @Override
    public Project saveProject(Project project) {
        ProjectJpaEntity projectJpaEntity;

        if (project.getProjectId() == null) {
            projectJpaEntity = ProjectJpaEntity.create(
                    project.getAuthor().getId().value(),
                    project.getTitle().value(),
                    project.getContent().value(),
                    project.getImage() != null ? project.getImage().value() : null,
                    project.getStartedAt().value(),
                    project.getEndedAt() != null ? project.getEndedAt().value() : null,
                    project.getTags());
        } else {
            projectJpaEntity = projectJpaRepository.findById(project.getProjectId().value())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Project not found: " + project.getProjectId().value()));

            projectJpaEntity.update(
                    project.getTitle().value(),
                    project.getContent().value(),
                    project.getImage() != null ? project.getImage().value() : null,
                    project.getStartedAt().value(),
                    project.getEndedAt() != null ? project.getEndedAt().value() : null,
                    project.getTags());

            if (project.getDeletedAt() != null) {
                projectJpaEntity.softDelete();
            }
        }

        ProjectJpaEntity saved = projectJpaRepository.save(projectJpaEntity);
        return mapToDomain(saved);
    }

    private Project mapToDomain(ProjectJpaEntity jpa) {
        Account author = accountPersistencePort.findById(jpa.getAccountId())
                .orElseGet(() -> Account.builder()
                        .id(new AccountId(jpa.getAccountId()))
                        .build());

        return Project.builder()
                .projectId(new ProjectId(jpa.getProjectId()))
                .author(author)
                .title(new ProjectTitle(jpa.getTitle()))
                .content(new ProjectContent(jpa.getContent()))
                .image(jpa.getImage() != null ? new ProjectImage(jpa.getImage()) : null)
                .startedAt(new StartedAt(jpa.getStartedAt()))
                .endedAt(jpa.getEndedAt() != null ? new EndedAt(jpa.getEndedAt()) : null)
                .createdAt(new CreatedAt(jpa.getCreatedAt()))
                .updatedAt(jpa.getUpdatedAt() != null ? new UpdatedAt(jpa.getUpdatedAt()) : null)
                .deletedAt(jpa.getDeletedAt() != null ? new DeletedAt(jpa.getDeletedAt()) : null)
                .tags(jpa.getTags())
                .build();
    }
}
