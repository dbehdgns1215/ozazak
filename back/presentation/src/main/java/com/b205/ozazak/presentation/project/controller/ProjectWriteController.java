package com.b205.ozazak.presentation.project.controller;

import com.b205.ozazak.application.project.command.CreateProjectCommand;
import com.b205.ozazak.application.project.command.UpdateProjectCommand;
import com.b205.ozazak.application.project.port.in.CreateProjectUseCase;
import com.b205.ozazak.application.project.port.in.DeleteProjectUseCase;
import com.b205.ozazak.application.project.port.in.UpdateProjectUseCase;
import com.b205.ozazak.application.project.result.GetProjectResult;
import com.b205.ozazak.presentation.project.dto.request.CreateProjectRequest;
import com.b205.ozazak.presentation.project.dto.request.UpdateProjectRequest;
import com.b205.ozazak.presentation.project.dto.response.ProjectResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Project API")
public class ProjectWriteController {

    private final CreateProjectUseCase createProjectUseCase;
    private final UpdateProjectUseCase updateProjectUseCase;
    private final DeleteProjectUseCase deleteProjectUseCase;

    @Operation(summary = "Create Project")
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@AuthenticationPrincipal Long userId,
            @RequestBody @Valid CreateProjectRequest request) {

        CreateProjectCommand command = CreateProjectCommand.builder()
                .accountId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .image(request.getImage())
                .startedAt(request.getStartedAt())
                .endedAt(request.getEndedAt())
                .tags(request.getTags())
                .build();
        GetProjectResult result = createProjectUseCase.createProject(command);

        return ResponseEntity.status(HttpStatus.CREATED).body(ProjectResponse.from(result));
    }

    @Operation(summary = "Update Project")
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@AuthenticationPrincipal Long userId, @PathVariable Long projectId,
            @RequestBody @Valid UpdateProjectRequest request) {
        UpdateProjectCommand command = UpdateProjectCommand.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .image(request.getImage())
                .startedAt(request.getStartedAt())
                .endedAt(request.getEndedAt())
                .tags(request.getTags())
                .build();
        GetProjectResult result = updateProjectUseCase.updateProject(userId, projectId, command);

        return ResponseEntity.ok(ProjectResponse.from(result));
    }

    @Operation(summary = "Delete Project")
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@AuthenticationPrincipal Long userId, @PathVariable Long projectId) {
        deleteProjectUseCase.deleteProject(userId, projectId);

        return ResponseEntity.noContent().build();
    }
}
