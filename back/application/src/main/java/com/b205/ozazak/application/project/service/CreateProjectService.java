package com.b205.ozazak.application.project.service;

import com.b205.ozazak.application.project.command.CreateProjectCommand;
import com.b205.ozazak.application.project.result.GetProjectResult;
import com.b205.ozazak.application.project.port.in.CreateProjectUseCase;
import com.b205.ozazak.application.project.port.out.SaveProjectPort;
import com.b205.ozazak.application.streak.service.StreakService;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.project.entity.Project;
import com.b205.ozazak.domain.project.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateProjectService implements CreateProjectUseCase {

    private final SaveProjectPort saveProjectPort;
    private final StreakService streakService;

    @Override
    public GetProjectResult createProject(CreateProjectCommand command) {
        Account author = Account.builder()
                .id(new AccountId(command.getAccountId()))
                .build();

        Project project = Project.builder()
                .author(author)
                .title(new ProjectTitle(command.getTitle()))
                .content(new ProjectContent(command.getContent()))
                .image(command.getImage() != null ? new ProjectImage(command.getImage()) : null)
                .startedAt(new StartedAt(command.getStartedAt()))
                .endedAt(command.getEndedAt() != null ? new EndedAt(command.getEndedAt()) : null)
                .createdAt(new CreatedAt(LocalDateTime.now()))
                .tags(command.getTags())
                .build();

        // 검사 내용들
        project.validateDateRange();

        Project saved = saveProjectPort.saveProject(project);

        // Update user streak
        streakService.recordActivity(author);

        return GetProjectResult.from(saved);
    }
}
