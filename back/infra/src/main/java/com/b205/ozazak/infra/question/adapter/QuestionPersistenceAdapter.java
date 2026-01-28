package com.b205.ozazak.infra.question.adapter;

import com.b205.ozazak.application.question.port.out.LoadQuestionPort;
import com.b205.ozazak.application.question.port.out.SaveQuestionPort;
import com.b205.ozazak.domain.company.entity.Company;
import com.b205.ozazak.domain.company.vo.CompanyId;
import com.b205.ozazak.domain.company.vo.CompanyImg;
import com.b205.ozazak.domain.company.vo.CompanyLocation;
import com.b205.ozazak.domain.company.vo.CompanyName;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.question.vo.*;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import com.b205.ozazak.domain.recruitment.vo.*;
import com.b205.ozazak.infra.question.entity.QuestionJpaEntity;
import com.b205.ozazak.infra.question.repository.QuestionJpaRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class QuestionPersistenceAdapter implements LoadQuestionPort, SaveQuestionPort {

    private final QuestionJpaRepository questionJpaRepository;
    private final EntityManager entityManager;

    @Override
    public List<Question> findAllByRecruitmentId(Long recruitmentId) {
        return questionJpaRepository.findByRecruitment_RecruitmentIdOrderByOrderValAsc(recruitmentId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Question save(Question question) {
        QuestionJpaEntity jpaEntity = toJpaEntity(question);
        QuestionJpaEntity saved = questionJpaRepository.save(jpaEntity);
        return toDomain(saved);
    }

    private Question toDomain(QuestionJpaEntity entity) {
        return Question.builder()
                .id(new QuestionId(entity.getQuestionId()))
                .recruitment(mapRecruitment(entity))
                .company(mapRecruitment(entity) != null ? mapRecruitment(entity).getCompany() : null)
                .content(entity.getContent() != null ? new QuestionContent(entity.getContent()) : null)
                .orderValue(entity.getOrderVal() != null ? new OrderValue(entity.getOrderVal()) : null)
                .charMax(entity.getCharMax() != null ? new CharMax(entity.getCharMax()) : null)
                .build();
    }

    private Recruitment mapRecruitment(QuestionJpaEntity entity) {
        if (entity.getRecruitment() == null) {
            return null;
        }
        // Basic mapping for reference
        return Recruitment.builder()
                .id(new RecruitmentId(entity.getRecruitment().getRecruitmentId()))
                .title(entity.getRecruitment().getTitle() != null ? new RecruitmentTitle(entity.getRecruitment().getTitle()) : null)
                .applyUrl(entity.getRecruitment().getApplyUrl() != null ? new ApplyUrl(entity.getRecruitment().getApplyUrl()) : null)
                .company(entity.getRecruitment().getCompany() != null ? Company.builder()
                        .id(new CompanyId(entity.getRecruitment().getCompany().getCompanyId()))
                        .name(entity.getRecruitment().getCompany().getName() != null ? new CompanyName(entity.getRecruitment().getCompany().getName()) : null)
                        .img(entity.getRecruitment().getCompany().getImg() != null ? new CompanyImg(entity.getRecruitment().getCompany().getImg()) : null)
                        .location(entity.getRecruitment().getCompany().getLocation() != null ? new CompanyLocation(entity.getRecruitment().getCompany().getLocation()) : null)
                        .build() : null)
                .build();
    }

    private QuestionJpaEntity toJpaEntity(Question question) {
        // recruitment은 nullable
        Long recruitmentId = question.getRecruitment() != null 
                ? question.getRecruitment().getId().value() 
                : null;
        
        if (recruitmentId != null) {
            var recruitmentRef = entityManager.getReference(
                    com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity.class,
                    recruitmentId
            );
            return QuestionJpaEntity.create(
                    recruitmentRef,
                    question.getContent().value(),
                    question.getOrderValue().value(),
                    question.getCharMax().value()
            );
        } else {
            // recruitment가 null인 경우
            return QuestionJpaEntity.create(
                    null,
                    question.getContent().value(),
                    question.getOrderValue().value(),
                    question.getCharMax().value()
            );
        }
    }
}
