package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.command.UpdateCommunityCommand;
import com.b205.ozazak.application.community.result.UpdateCommunityResult;

public interface UpdateCommunityUseCase {
    UpdateCommunityResult update(UpdateCommunityCommand command);
}
