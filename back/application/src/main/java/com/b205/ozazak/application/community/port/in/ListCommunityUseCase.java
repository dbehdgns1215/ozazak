package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.command.ListCommunityCommand;
import com.b205.ozazak.application.community.result.ListCommunityResult;

public interface ListCommunityUseCase {
    ListCommunityResult list(ListCommunityCommand command);
}
