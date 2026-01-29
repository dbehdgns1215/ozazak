package com.b205.ozazak.application.community.port.out.dto;

import com.b205.ozazak.application.community.result.TilItemResult;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Adapter-local mutable DTO for merging batch-loaded data
 * Used only in infrastructure layer
 */
@Data
@Builder
public class TilRow {
    private Long communityId;
    private String title;
    private String content;
    private Long authorId;
    private String authorName;
    private String authorImg;
    private String companyName;
    private Integer view;
    private LocalDateTime createdAt;
    
    // Batch-loaded fields (set after initial fetch)
    private List<String> tags;
    private Long commentCount;
    private List<TilItemResult.ReactionInfo> reactions;
}
