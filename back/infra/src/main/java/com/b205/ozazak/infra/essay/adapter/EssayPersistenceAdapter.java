package com.b205.ozazak.infra.essay.adapter;

import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.coverletter.vo.CoverletterId;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.*;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.question.vo.QuestionId;
import com.b205.ozazak.infra.essay.entity.EssayJpaEntity;
import com.b205.ozazak.infra.essay.repository.EssayJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EssayPersistenceAdapter implements LoadEssayPort {

    private final EssayJpaRepository essayJpaRepository;

    @Override
    public List<Essay> findAllByCoverletterId(Long coverletterId) {
        return essayJpaRepository.findByCoverletter_CoverletterIdAndDeletedAtIsNull(coverletterId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private Essay toDomain(EssayJpaEntity entity) {
        return Essay.builder()
                .id(new EssayId(entity.getEssayId()))
                .coverletter(Coverletter.builder()
                        .id(new CoverletterId(entity.getCoverletter().getCoverletterId()))
                        .build()) // Minimal reference
                .question(Question.builder()
                        .id(new QuestionId(entity.getQuestion().getQuestionId()))
                        .build()) // Minimal reference
                .content(new EssayContent(entity.getContent()))
                .version(new Version(entity.getVersion()))
                .versionTitle(new VersionTitle(entity.getVersionTitle()))
                .isCurrent(new IsCurrent(entity.getIsCurrent()))
                .deletedAt(entity.getDeletedAt() != null ? new DeletedAt(entity.getDeletedAt()) : null)
                .build();
    }
}
