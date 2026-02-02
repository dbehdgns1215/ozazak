package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.command.CreateCommunityCommand;
import com.b205.ozazak.application.community.result.CreateCommunityResult;

public interface CreateCommunityUseCase {
    CreateCommunityResult create(CreateCommunityCommand command);
}
