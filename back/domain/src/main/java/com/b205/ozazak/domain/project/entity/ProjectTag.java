package com.b205.ozazak.domain.project.entity;

import com.b205.ozazak.domain.project.vo.TagName;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectTag {
    private final Project project;
    private final TagName name;
}
