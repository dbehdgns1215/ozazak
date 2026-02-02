package com.b205.ozazak.application.community.port.out.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class CommunityListPage {
    private final List<CommunityRow> rows;
    private final long totalElements;
    private final int totalPages;
    private final int currentPage;
    private final int size;
}
