package com.b205.ozazak.presentation.project.deleteProject;

import com.b205.ozazak.application.project.port.in.DeleteProjectUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b205.ozazak.application.project.command.DeleteProjectCommand;

import com.b205.ozazak.application.auth.model.CustomPrincipal;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Project API")
public class DeleteProjectController {

    private final DeleteProjectUseCase deleteProjectUseCase;

    @Operation(summary = "Delete Project")
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long projectId) {
        deleteProjectUseCase.deleteProject(
                DeleteProjectCommand.builder()
                        .userId(principal.getAccountId())
                        .projectId(projectId)
                        .build());
        return ResponseEntity.noContent().build();
    }
}
