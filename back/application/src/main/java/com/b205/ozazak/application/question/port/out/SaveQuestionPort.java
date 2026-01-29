package com.b205.ozazak.application.question.port.out;

import com.b205.ozazak.domain.question.entity.Question;

public interface SaveQuestionPort {
    Question save(Question question);
}
