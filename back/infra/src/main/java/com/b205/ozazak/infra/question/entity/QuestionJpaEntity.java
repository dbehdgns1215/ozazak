package com.b205.ozazak.infra.question.entity;

import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "question")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class QuestionJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id")
    private RecruitmentJpaEntity recruitment;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "order_val")
    private Integer orderVal;

    @Column(name = "char_max")
    private Integer charMax;

    private QuestionJpaEntity(RecruitmentJpaEntity recruitment, String content, Integer orderVal, Integer charMax) {
        this.recruitment = recruitment;
        this.content = content;
        this.orderVal = orderVal;
        this.charMax = charMax;
    }

    public static QuestionJpaEntity create(RecruitmentJpaEntity recruitment, String content, Integer orderVal, Integer charMax) {
        return new QuestionJpaEntity(recruitment, content, orderVal, charMax);
    }
}
