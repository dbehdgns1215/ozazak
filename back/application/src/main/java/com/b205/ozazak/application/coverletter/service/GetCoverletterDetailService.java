package com.b205.ozazak.application.coverletter.service;

import com.b205.ozazak.application.coverletter.command.GetCoverletterDetailCommand;
import com.b205.ozazak.application.coverletter.port.in.GetCoverletterDetailUseCase;
import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
import com.b205.ozazak.application.coverletter.result.CoverletterDetailResult;
import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.question.port.out.LoadQuestionPort;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.question.entity.Question;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetCoverletterDetailService implements GetCoverletterDetailUseCase {

    private final LoadCoverletterPort loadCoverletterPort;
    private final LoadQuestionPort loadQuestionPort;
    private final LoadEssayPort loadEssayPort;

    @Override
    public CoverletterDetailResult execute(GetCoverletterDetailCommand command) {
        Long accountId = command.getAccountId();
        Long coverletterId = command.getCoverletterId();
        
        // 1. Get Coverletter (Ownership verification included)
        Coverletter coverletter = loadCoverletterPort.findByIdAndAccountId(coverletterId, accountId)
                .orElseThrow(() -> new IllegalArgumentException("자소서를 찾을 수 없거나 접근 권한이 없습니다."));

        // 2. Get Questions from Recruitment
        List<Question> questions = loadQuestionPort.findAllByRecruitmentId(coverletter.getRecruitment().getId().value());

        // 3. Get Essays for Coverletter
        List<Essay> essays = loadEssayPort.findAllByCoverletterId(coverletterId);

        // 4. Group Essays by Question ID
        Map<Long, List<Essay>> essaysByQuestion = essays.stream()
                .collect(Collectors.groupingBy(essay -> essay.getQuestion().getId().value()));

        // 5. Assemble Result
        List<CoverletterDetailResult.EssayGroupResult> essayGroups = questions.stream()
                .map(question -> {
                    List<Essay> relatedEssays = essaysByQuestion.getOrDefault(question.getId().value(), List.of());
                    return CoverletterDetailResult.from(question, relatedEssays);
                })
                .collect(Collectors.toList());

        return CoverletterDetailResult.of(coverletter, essayGroups);
    }
}
