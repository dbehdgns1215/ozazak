package com.b205.ozazak.presentation.project.getProject;

import com.b205.ozazak.application.project.port.in.GetProjectUseCase;
import com.b205.ozazak.application.project.result.GetProjectResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b205.ozazak.application.project.command.GetProjectCommand;

import com.b205.ozazak.application.auth.model.CustomPrincipal;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Project API")
public class GetProjectController {

    private final GetProjectUseCase getProjectUseCase;

    @Operation(summary = "Get Project Detail")
    @GetMapping("/{projectId}")
    public ResponseEntity<GetProjectResponse> getProject(
            @AuthenticationPrincipal CustomPrincipal principal,
            @PathVariable Long projectId) {
        GetProjectResult result = getProjectUseCase.getProject(
                GetProjectCommand.builder()
                        .userId(principal.getAccountId())
                        .projectId(projectId)
                        .build());
        return ResponseEntity.ok(GetProjectResponse.from(result));
    }
}
