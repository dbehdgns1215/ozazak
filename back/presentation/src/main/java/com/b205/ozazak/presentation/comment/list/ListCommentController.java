package com.b205.ozazak.presentation.comment.list;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.comment.port.in.ListCommentUseCase;
import com.b205.ozazak.application.comment.query.ListCommentQuery;
import com.b205.ozazak.application.comment.result.ListCommentResult;
import com.b205.ozazak.application.comment.result.ListCommentResult.CommentItemResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community-posts")
@RequiredArgsConstructor
public class ListCommentController {

    private final ListCommentUseCase listCommentUseCase;

    @GetMapping("/{communityId}/comments")
    public ResponseEntity<Map<String, ListCommentResponse>> listComments(
            @PathVariable Long communityId,
            @AuthenticationPrincipal CustomPrincipal principal
    ) {
        Long viewerAccountId = principal != null ? principal.getAccountId() : null;

        ListCommentQuery query = ListCommentQuery.builder()
                .communityId(communityId)
                .viewerAccountId(viewerAccountId)
                .build();

        ListCommentResult result = listCommentUseCase.list(query);

        ListCommentResponse response = mapToResponse(result);

        return ResponseEntity.ok(Map.of("data", response));
    }

    private ListCommentResponse mapToResponse(ListCommentResult result) {
        List<ListCommentResponse.CommentItem> items = result.getItems().stream()
                .map(this::mapItem)
                .collect(Collectors.toList());

        return ListCommentResponse.builder()
                .items(items)
                .pageInfo(null)  // Reserved for future pagination
                .build();
    }

    private ListCommentResponse.CommentItem mapItem(CommentItemResult item) {
        return ListCommentResponse.CommentItem.builder()
                .commentId(item.getCommentId())
                .author(ListCommentResponse.AuthorInfo.builder()
                        .accountId(item.getAuthor().getAccountId())
                        .img(item.getAuthor().getImg())
                        .name(item.getAuthor().getName())
                        .companyName(item.getAuthor().getCompanyName())
                        .build())
                .content(item.getContent())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .isMine(item.isMine())
                .build();
    }
}
