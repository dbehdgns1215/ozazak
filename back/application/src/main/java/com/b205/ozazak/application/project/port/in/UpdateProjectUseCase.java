package com.b205.ozazak.application.project.port.in;

import com.b205.ozazak.application.project.result.GetProjectResult;
import com.b205.ozazak.application.project.command.UpdateProjectCommand;

public interface UpdateProjectUseCase {
    GetProjectResult updateProject(Long userId, Long projectId, UpdateProjectCommand command);
}
