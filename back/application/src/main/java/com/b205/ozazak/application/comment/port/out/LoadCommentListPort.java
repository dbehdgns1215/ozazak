package com.b205.ozazak.application.comment.port.out;

import com.b205.ozazak.application.comment.port.out.dto.CommentRow;

import java.util.List;

public interface LoadCommentListPort {
    List<CommentRow> loadByCommunityId(Long communityId);
}
