package com.b205.ozazak.application.comment.port.in;

import com.b205.ozazak.application.comment.command.DeleteCommentCommand;
import com.b205.ozazak.application.comment.result.DeleteCommentResult;

public interface DeleteCommentUseCase {
    DeleteCommentResult delete(DeleteCommentCommand command);
}
