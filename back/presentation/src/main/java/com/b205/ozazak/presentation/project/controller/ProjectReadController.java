package com.b205.ozazak.presentation.project.controller;

import com.b205.ozazak.application.project.port.in.GetProjectUseCase;
import com.b205.ozazak.application.project.result.GetProjectResult;
import com.b205.ozazak.presentation.project.dto.response.ProjectResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Project API")
public class ProjectReadController {

    private final GetProjectUseCase getProjectUseCase;

    @Operation(summary = "Get Project Detail")
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(@AuthenticationPrincipal Long userId, @PathVariable Long projectId) {
        GetProjectResult result = getProjectUseCase.getProject(userId, projectId);
        return ResponseEntity.ok(ProjectResponse.from(result));
    }

    @Operation(summary = "Get Project List")
    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getProjectList(@AuthenticationPrincipal Long userId,
            Pageable pageable) {
        Page<GetProjectResult> results = getProjectUseCase.getProjectList(userId, pageable);
        return ResponseEntity.ok(results.map(ProjectResponse::from));
    }
}
