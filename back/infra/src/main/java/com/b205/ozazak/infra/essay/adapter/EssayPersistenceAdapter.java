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
import java.util.Optional;
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
    public Optional<Essay> findById(Long essayId) {
        return essayJpaRepository.findById(essayId)
                .filter(e -> e.getDeletedAt() == null)
                .map(this::toDomain);
    }

    @Override
    public List<Essay> findAllByCoverletterIdAndQuestionId(Long coverletterId, Long questionId) {
        return essayJpaRepository
                .findByCoverletter_CoverletterIdAndQuestion_QuestionIdAndDeletedAtIsNull(
                        coverletterId, questionId
                )
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
        // Coverletter에 Account 정보 포함 (소유권 검증용)
        Coverletter coverletter = Coverletter.builder()
                .id(new CoverletterId(entity.getCoverletter().getCoverletterId()))
                .account(com.b205.ozazak.domain.account.entity.Account.builder()
                        .id(new com.b205.ozazak.domain.account.vo.AccountId(
                                entity.getCoverletter().getAccount().getAccountId()))
                        .build())
                .build();
        
        return Essay.builder()
                .id(new EssayId(entity.getEssayId()))
                .coverletter(coverletter)
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
        // Essay ID가 있으면 기존 엔티티 조회 및 업데이트
        if (essay.getId() != null && essay.getId().value() != null) {
            EssayJpaEntity existing = essayJpaRepository.findById(essay.getId().value())
                    .orElseThrow(() -> new IllegalArgumentException("Essay not found: " + essay.getId().value()));
            
            // content, versionTitle 업데이트 (PATCH)
            existing.updateContent(essay.getContent().value());
            existing.updateVersionTitle(essay.getVersionTitle().value());
            return existing;
        }
        
        // 새 Essay 생성
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
