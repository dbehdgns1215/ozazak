package com.b205.ozazak.application.project.port.in;

import com.b205.ozazak.application.project.result.GetProjectResult;
import org.springframework.data.domain.Page;

import com.b205.ozazak.application.project.command.GetProjectCommand;
import com.b205.ozazak.application.project.command.GetProjectListCommand;

public interface GetProjectUseCase {
    GetProjectResult getProject(GetProjectCommand command);

    Page<GetProjectResult> getProjectList(GetProjectListCommand command);
}
