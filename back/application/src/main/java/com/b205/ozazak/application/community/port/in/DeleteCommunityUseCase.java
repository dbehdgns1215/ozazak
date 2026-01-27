package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.command.DeleteCommunityCommand;
import com.b205.ozazak.application.community.result.DeleteCommunityResult;

public interface DeleteCommunityUseCase {
    DeleteCommunityResult delete(DeleteCommunityCommand command);
}
