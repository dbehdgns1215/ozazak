package com.b205.ozazak.infra.essay.adapter;

import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.coverletter.vo.CoverletterId;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.*;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.question.vo.QuestionId;
import com.b205.ozazak.infra.essay.entity.EssayJpaEntity;
import com.b205.ozazak.infra.essay.repository.EssayJpaRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EssayPersistenceAdapter implements LoadEssayPort, SaveEssayPort {

    private final EssayJpaRepository essayJpaRepository;
    private final EntityManager entityManager;

    @Override
    public List<Essay> findAllByCoverletterId(Long coverletterId) {
        return essayJpaRepository.findByCoverletter_CoverletterIdAndDeletedAtIsNull(coverletterId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Essay> saveAll(List<Essay> essays) {
        List<EssayJpaEntity> jpaEntities = essays.stream()
                .map(this::toJpaEntity)
                .collect(Collectors.toList());
        
        List<EssayJpaEntity> saved = essayJpaRepository.saveAll(jpaEntities);
        
        return saved.stream()
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

    private EssayJpaEntity toJpaEntity(Essay essay) {
        var coverletterRef = entityManager.getReference(
                com.b205.ozazak.infra.coverletter.entity.CoverletterJpaEntity.class,
                essay.getCoverletter().getId().value()
        );
        
        var questionRef = entityManager.getReference(
                com.b205.ozazak.infra.question.entity.QuestionJpaEntity.class,
                essay.getQuestion().getId().value()
        );
        
        return EssayJpaEntity.create(
                coverletterRef,
                questionRef,
                essay.getContent().value(),
                essay.getVersion().value(),
                essay.getVersionTitle().value()
        );
    }
}
