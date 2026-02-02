package com.b205.ozazak.application.comment.port.in;

import com.b205.ozazak.application.comment.query.ListCommentQuery;
import com.b205.ozazak.application.comment.result.ListCommentResult;

public interface ListCommentUseCase {
    ListCommentResult list(ListCommentQuery query);
}
