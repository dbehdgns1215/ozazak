package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.application.community.port.out.dto.ListTilQuery;
import com.b205.ozazak.application.community.port.out.dto.TilListPage;

/**
 * Out port for loading TIL list
 */
public interface LoadTilListPort {
    /**
     * Load paginated TIL list with filters
     * @param query query parameters
     * @return paginated TIL rows
     */
    TilListPage loadTilList(ListTilQuery query);
}
