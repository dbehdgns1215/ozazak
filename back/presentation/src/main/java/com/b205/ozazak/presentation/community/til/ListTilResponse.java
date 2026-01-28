package com.b205.ozazak.presentation.community.til;

import com.b205.ozazak.application.community.result.ListTilResult;
import com.b205.ozazak.application.community.result.PageInfoResult;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for TIL list - matches exact API contract
 */
public record ListTilResponse(
    List<TilItemDto> items,
    PageInfoDto pageInfo
) {
    public static ListTilResponse from(ListTilResult result) {
        List<TilItemDto> items = result.items().stream()
                .map(TilItemDto::from)
                .toList();
        
        PageInfoDto pageInfo = PageInfoDto.from(result.pageInfo());
        
        return new ListTilResponse(items, pageInfo);
    }
    
    public record TilItemDto(
        Long tilId,
        String title,
        String content,
        AuthorDto author,
        List<String> tags,
        Integer view,
        Long commentCount,
        List<ReactionDto> reaction,  // Note: "reaction" not "reactions" per spec
        LocalDateTime createdAt
    ) {
        public static TilItemDto from(com.b205.ozazak.application.community.result.TilItemResult item) {
            AuthorDto author = new AuthorDto(
                item.author().accountId(),
                item.author().name(),
                item.author().img(),
                item.author().companyName()
            );
            
            List<ReactionDto> reactions = item.reactions().stream()
                    .map(r -> new ReactionDto(r.type(), r.count()))
                    .toList();
            
            return new TilItemDto(
                item.tilId(),
                item.title(),
                item.content(),
                author,
                item.tags(),
                item.view(),
                item.commentCount(),
                reactions,
                item.createdAt()
            );
        }
    }
    
    public record AuthorDto(
        Long accountId,
        String name,
        String img,
        String companyName  // nullable
    ) {}
    
    public record ReactionDto(
        Integer type,
        Long count
    ) {}
    
    public record PageInfoDto(
        Integer currentPage,
        Integer pageSize,
        Long totalElements,
        Integer totalPages,
        Boolean hasNext,
        Boolean hasPrevious
    ) {
        public static PageInfoDto from(PageInfoResult pageInfo) {
            return new PageInfoDto(
                pageInfo.currentPage(),
                pageInfo.pageSize(),
                pageInfo.totalElements(),
                pageInfo.totalPages(),
                pageInfo.hasNext(),
                pageInfo.hasPrevious()
            );
        }
    }
}
