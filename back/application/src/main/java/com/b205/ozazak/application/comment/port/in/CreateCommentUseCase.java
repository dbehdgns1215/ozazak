package com.b205.ozazak.application.comment.port.in;

import com.b205.ozazak.application.comment.command.CreateCommentCommand;
import com.b205.ozazak.application.comment.result.CreateCommentResult;

public interface CreateCommentUseCase {
    CreateCommentResult create(CreateCommentCommand command);
}
