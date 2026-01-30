package com.b205.ozazak.application.coverletter.service;

import com.b205.ozazak.application.block.service.BlockExtractionService;
import com.b205.ozazak.application.coverletter.command.CreateCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.CreateCoverletterUseCase;
import com.b205.ozazak.application.coverletter.port.out.SaveCoverletterPort;
import com.b205.ozazak.application.coverletter.result.CreateCoverletterResult;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.application.question.port.out.SaveQuestionPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.coverletter.vo.CoverletterTitle;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.EssayContent;
import com.b205.ozazak.domain.essay.vo.IsCurrent;
import com.b205.ozazak.domain.essay.vo.Version;
import com.b205.ozazak.domain.essay.vo.VersionTitle;
import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.question.vo.CharMax;
import com.b205.ozazak.domain.question.vo.OrderValue;
import com.b205.ozazak.domain.question.vo.QuestionContent;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import com.b205.ozazak.domain.recruitment.vo.RecruitmentId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateCoverletterService implements CreateCoverletterUseCase {

    private final SaveCoverletterPort saveCoverletterPort;
    private final SaveQuestionPort saveQuestionPort;
    private final SaveEssayPort saveEssayPort;
    private final BlockExtractionService blockExtractionService;

    @Override
    public CreateCoverletterResult execute(CreateCoverletterCommand command) {
        // 1. Coverletter 도메인 엔티티 생성 및 저장
        Coverletter coverletter = createCoverletter(command);
        Coverletter savedCoverletter = saveCoverletterPort.save(coverletter);

        // 2. 각 Essay에 대해 Question 생성 후 Essay 생성
        List<Essay> essays = new ArrayList<>();
        int order = 1;
        
        for (CreateCoverletterCommand.EssayData essayData : command.getEssays()) {
            // 2-1. 새 Question 생성 및 저장
            Question question = createQuestion(essayData, order++, command.getRecruitmentId());
            Question savedQuestion = saveQuestionPort.save(question);

            // 2-2. Essay 생성
            Essay essay = createEssay(savedCoverletter, savedQuestion, essayData);
            essays.add(essay);
        }

        // 3. Essays 일괄 저장
        List<Essay> savedEssays = saveEssayPort.saveAll(essays);

        // 4. recruitmentId 없으면 사용자 기존 자소서 → 블록 추출 요청 (비동기)
        if (command.getRecruitmentId() == null) {
            List<String> essayContents = command.getEssays().stream()
                    .map(CreateCoverletterCommand.EssayData::getEssayContent)
                    .filter(c -> c != null && !c.trim().isEmpty())
                    .collect(Collectors.toList());
            
            if (!essayContents.isEmpty()) {
                blockExtractionService.extractAndSaveBlocksAsync(
                        command.getAccountId(),
                        essayContents
                );
            }
        }

        // 5. Result 생성
        return CreateCoverletterResult.builder()
                .coverletterId(savedCoverletter.getId().value())
                .title(savedCoverletter.getTitle().value())
                .essayIds(savedEssays.stream()
                        .map(e -> e.getId().value())
                        .collect(Collectors.toList()))
                .build();
    }

    private Coverletter createCoverletter(CreateCoverletterCommand command) {
        Coverletter.CoverletterBuilder builder = Coverletter.builder()
                .account(Account.builder()
                        .id(new AccountId(command.getAccountId()))
                        .build())
                .title(new CoverletterTitle(command.getTitle()));

        // recruitmentId는 nullable
        if (command.getRecruitmentId() != null) {
            builder.recruitment(Recruitment.builder()
                    .id(new RecruitmentId(command.getRecruitmentId()))
                    .build());
        }

        return builder.build();
    }

    private Question createQuestion(CreateCoverletterCommand.EssayData essayData, 
                                    int order, 
                                    Long recruitmentId) {
        Question.QuestionBuilder builder = Question.builder()
                .content(new QuestionContent(essayData.getQuestionContent()))
                .orderValue(new OrderValue(order))
                .charMax(new CharMax(essayData.getCharMax()));

        // recruitmentId는 nullable
        if (recruitmentId != null) {
            builder.recruitment(Recruitment.builder()
                    .id(new RecruitmentId(recruitmentId))
                    .build());
        }

        return builder.build();
    }

    private Essay createEssay(Coverletter coverletter, 
                             Question question, 
                             CreateCoverletterCommand.EssayData essayData) {
        return Essay.builder()
                .coverletter(coverletter)
                .question(question)
                .content(new EssayContent(essayData.getEssayContent()))
                .version(new Version(1))
                .versionTitle(new VersionTitle("v1"))
                .isCurrent(new IsCurrent(true))
                .build();
    }
}

