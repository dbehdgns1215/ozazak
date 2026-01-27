package com.b205.ozazak.application.project.port.out;

import com.b205.ozazak.domain.project.entity.Project;

import java.util.Optional;

public interface LoadProjectPort {
    Optional<Project> loadProject(Long projectId);
}
