package com.b205.ozazak.application.project.port.in;

import com.b205.ozazak.application.project.command.CreateProjectCommand;
import com.b205.ozazak.application.project.result.GetProjectResult;

public interface CreateProjectUseCase {
    GetProjectResult createProject(CreateProjectCommand command);
}
