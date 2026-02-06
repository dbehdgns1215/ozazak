package com.b205.ozazak.infra.essay.adapter;

import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.coverletter.vo.CoverletterId;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.*;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.question.vo.QuestionId;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import com.b205.ozazak.domain.recruitment.vo.RecruitmentContent;
import com.b205.ozazak.domain.recruitment.vo.RecruitmentId;
import com.b205.ozazak.infra.essay.entity.EssayJpaEntity;
import com.b205.ozazak.infra.essay.repository.EssayJpaRepository;
import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EssayPersistenceAdapter
                implements LoadEssayPort, SaveEssayPort, com.b205.ozazak.application.essay.port.out.DeleteEssayPort {

        private final EssayJpaRepository essayJpaRepository;
        private final EntityManager entityManager;

        @Override
        public List<Essay> findAllByCoverletterId(Long coverletterId) {
                return essayJpaRepository
                                .findByCoverletter_CoverletterIdAndDeletedAtIsNull(coverletterId)
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
                                                coverletterId, questionId)
                                .stream()
                                .map(this::toDomain)
                                .collect(Collectors.toList());
        }

        @Override
        public Essay save(Essay essay) {
                // ID가 있으면 기존 엔티티 업데이트 (UPDATE)
                if (essay.getId() != null && essay.getId().value() != null) {
                        EssayJpaEntity existing = essayJpaRepository.findById(essay.getId().value())
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Essay not found: " + essay.getId().value()));

                        // ✅ 모든 필드 업데이트
                        existing.updateIsCurrent(essay.getIsCurrent().value());
                        existing.updateContent(essay.getContent().value());
                        existing.updateVersionTitle(essay.getVersionTitle().value());

                        return toDomain(existing);
                }

                // ID가 없으면 새 엔티티 생성 (INSERT)
                EssayJpaEntity jpaEntity = toJpaEntity(essay);
                EssayJpaEntity saved = essayJpaRepository.save(jpaEntity);
                return toDomain(saved);
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
                                                .content(new com.b205.ozazak.domain.question.vo.QuestionContent(
                                                                entity.getQuestion().getContent()))
                                                .charMax(entity.getQuestion().getCharMax() != null
                                                                ? new com.b205.ozazak.domain.question.vo.CharMax(
                                                                                entity.getQuestion().getCharMax())
                                                                : null)
                                                .recruitment(toRecruitmentDomain(entity.getQuestion().getRecruitment()))
                                                .build())
                                .content(new EssayContent(entity.getContent()))
                                .version(new Version(entity.getVersion()))
                                .versionTitle(new VersionTitle(entity.getVersionTitle()))
                                .isCurrent(new IsCurrent(entity.getIsCurrent()))
                                .deletedAt(entity.getDeletedAt() != null ? new DeletedAt(entity.getDeletedAt()) : null)
                                .build();
        }

        private Recruitment toRecruitmentDomain(RecruitmentJpaEntity entity) {
                if (entity == null)
                        return null;
                return Recruitment.builder()
                                .id(new RecruitmentId(entity.getRecruitmentId()))
                                .content(new RecruitmentContent(entity.getContent()))
                                .build();
        }

        private EssayJpaEntity toJpaEntity(Essay essay) {
                // Essay ID가 있으면 기존 엔티티 조회 및 업데이트
                if (essay.getId() != null && essay.getId().value() != null) {
                        EssayJpaEntity existing = essayJpaRepository.findById(essay.getId().value())
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Essay not found: " + essay.getId().value()));

                        // ✅ isCurrent 업데이트 추가 (핵심 수정!)
                        existing.updateIsCurrent(essay.getIsCurrent().value());

                        // content, versionTitle 업데이트
                        existing.updateContent(essay.getContent().value());
                        existing.updateVersionTitle(essay.getVersionTitle().value());

                        return existing;
                }

                // 새 Essay 생성
                var coverletterRef = entityManager.getReference(
                                com.b205.ozazak.infra.coverletter.entity.CoverletterJpaEntity.class,
                                essay.getCoverletter().getId().value());

                var questionRef = entityManager.getReference(
                                com.b205.ozazak.infra.question.entity.QuestionJpaEntity.class,
                                essay.getQuestion().getId().value());

                return EssayJpaEntity.create(
                                coverletterRef,
                                questionRef,
                                essay.getContent().value(),
                                essay.getVersion().value(),
                                essay.getVersionTitle().value());
        }

        @Override
        public void deleteById(Long essayId) {
                essayJpaRepository.deleteById(essayId);
        }

        @Override
        public int deleteAllByCoverletterId(Long coverletterId) {
                return essayJpaRepository.deleteByCoverletter_CoverletterId(coverletterId);
        }
}
