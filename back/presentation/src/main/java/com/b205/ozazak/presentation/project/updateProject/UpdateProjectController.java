package com.b205.ozazak.presentation.project.updateProject;

import com.b205.ozazak.application.project.command.UpdateProjectCommand;
import com.b205.ozazak.application.project.port.in.UpdateProjectUseCase;
import com.b205.ozazak.application.project.result.GetProjectResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.b205.ozazak.application.auth.model.CustomPrincipal;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Project API")
public class UpdateProjectController {

    private final UpdateProjectUseCase updateProjectUseCase;

    @Operation(summary = "Update Project")
    @PutMapping("/{projectId}")
    public ResponseEntity<UpdateProjectResponse> updateProject(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long projectId,
            @RequestBody @Valid UpdateProjectRequest request) {
        UpdateProjectCommand command = UpdateProjectCommand.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .image(request.getThumbnailUrl())
                .startedAt(request.getStartedAt())
                .endedAt(request.getEndedAt())
                .tags(request.getTags())
                .build();

        GetProjectResult result = updateProjectUseCase.updateProject(principal.getAccountId(), projectId, command);

        return ResponseEntity.ok(UpdateProjectResponse.from(result));
    }
}
