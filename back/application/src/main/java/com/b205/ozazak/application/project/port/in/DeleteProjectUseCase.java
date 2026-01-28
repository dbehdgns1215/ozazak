package com.b205.ozazak.application.project.port.in;

import com.b205.ozazak.application.project.command.DeleteProjectCommand;

public interface DeleteProjectUseCase {
    void deleteProject(DeleteProjectCommand command);
}
