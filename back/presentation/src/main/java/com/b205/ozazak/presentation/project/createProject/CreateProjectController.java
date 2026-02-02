package com.b205.ozazak.presentation.project.createProject;

import com.b205.ozazak.application.project.command.CreateProjectCommand;
import com.b205.ozazak.application.project.port.in.CreateProjectUseCase;
import com.b205.ozazak.application.project.result.GetProjectResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b205.ozazak.application.auth.model.CustomPrincipal;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Project API")
public class CreateProjectController {

        private final CreateProjectUseCase createProjectUseCase;

        @Operation(summary = "Create Project")
        @PostMapping
        public ResponseEntity<CreateProjectResponse> createProject(
                        @AuthenticationPrincipal CustomPrincipal principal,
                        @RequestBody @Valid CreateProjectRequest request) {
                CreateProjectCommand command = CreateProjectCommand.builder()
                                .accountId(principal.getAccountId())
                                .title(request.getTitle())
                                .content(request.getContent())
                                .image(request.getThumbnailUrl())
                                .startedAt(request.getStartedAt())
                                .endedAt(request.getEndedAt())
                                .tags(request.getTags())
                                .build();

                GetProjectResult result = createProjectUseCase.createProject(command);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(CreateProjectResponse.from(result));
        }
}
