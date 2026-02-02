package com.b205.ozazak.application.project.port.out;

import com.b205.ozazak.domain.project.entity.Project;

public interface SaveProjectPort {
    Project saveProject(Project project);
}
