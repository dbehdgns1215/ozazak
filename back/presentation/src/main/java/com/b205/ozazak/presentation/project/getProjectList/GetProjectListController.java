package com.b205.ozazak.presentation.project.getProjectList;

import com.b205.ozazak.application.project.port.in.GetProjectUseCase;
import com.b205.ozazak.application.project.result.GetProjectResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "Project API")
public class GetProjectListController {

    private final GetProjectUseCase getProjectUseCase;

    @Operation(summary = "Get Project List")
    @GetMapping
    public ResponseEntity<Page<GetProjectListResponse>> getProjectList(
            @AuthenticationPrincipal Long userId,
            Pageable pageable) {
        Page<GetProjectResult> results = getProjectUseCase.getProjectList(userId, pageable);
        return ResponseEntity.ok(results.map(GetProjectListResponse::from));
    }
}
