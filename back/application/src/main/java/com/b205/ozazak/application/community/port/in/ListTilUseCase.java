package com.b205.ozazak.application.community.port.in;

import com.b205.ozazak.application.community.command.ListTilCommand;
import com.b205.ozazak.application.community.result.ListTilResult;

/**
 * Use case for listing TIL posts
 */
public interface ListTilUseCase {
    /**
     * List TIL posts with filters and pagination
     * @param command query parameters
     * @return paginated TIL list
     */
    ListTilResult list(ListTilCommand command);
}
