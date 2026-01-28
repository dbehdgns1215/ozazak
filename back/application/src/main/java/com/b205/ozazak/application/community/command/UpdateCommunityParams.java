package com.b205.ozazak.application.community.command;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * Primitive-only parameters for outgoing port updates.
 * This decouples the infrastructure layer from the Application Command object.
 */
@Getter
@Builder
public class UpdateCommunityParams {
    private final Integer communityCode;
    private final String title;
    private final String content;
    private final List<String> tags;
}
