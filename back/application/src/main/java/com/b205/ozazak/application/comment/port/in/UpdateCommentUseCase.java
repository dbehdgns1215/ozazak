package com.b205.ozazak.application.comment.port.in;

import com.b205.ozazak.application.comment.command.UpdateCommentCommand;
import com.b205.ozazak.application.comment.result.UpdateCommentResult;

public interface UpdateCommentUseCase {
    UpdateCommentResult update(UpdateCommentCommand command);
}
