package com.b205.ozazak.application.community.command;

import lombok.Builder;

import java.util.List;

/**
 * Command for listing TIL posts
 */
@Builder
public record ListTilCommand(
    List<String> tags,
    Integer page,
    Integer size,
    String authorName
) {}
