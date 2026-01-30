package com.b205.ozazak.application.coverletter.service;

import com.b205.ozazak.application.coverletter.command.CheckCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.CheckCoverletterUseCase;
import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
import com.b205.ozazak.application.coverletter.port.out.SaveCoverletterPort;
import com.b205.ozazak.application.coverletter.result.CheckCoverletterResult;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.application.question.port.out.LoadQuestionPort;
import com.b205.ozazak.application.recruitment.port.out.LoadRecruitmentPort;
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
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CheckCoverletterService implements CheckCoverletterUseCase {

    private final LoadCoverletterPort loadCoverletterPort;
    private final LoadRecruitmentPort loadRecruitmentPort;
    private final SaveCoverletterPort saveCoverletterPort;
    private final LoadQuestionPort loadQuestionPort;
    private final SaveEssayPort saveEssayPort;

    @Override
    public CheckCoverletterResult execute(CheckCoverletterCommand command) {
        Long accountId = command.getAccountId();
        Long recruitmentId = command.getRecruitmentId();
        
        // 1. Check if coverletter already exists
        return loadCoverletterPort.findByAccountIdAndRecruitmentId(accountId, recruitmentId)
                .map(existing -> CheckCoverletterResult.existing(existing.getId().value()))
                .orElseGet(() -> {
                    // 2. Load recruitment to get company name
                    Recruitment recruitment = loadRecruitmentPort.loadRecruitment(recruitmentId)
                            .orElseThrow(() -> new IllegalArgumentException("Recruitment not found: " + recruitmentId));

                    // 3. Create new coverletter domain entity
                    String defaultTitle = recruitment.getCompany() != null 
                            && recruitment.getCompany().getName() != null
                            ? recruitment.getCompany().getName().value() + " 자소서"
                            : "자기소개서";  // company 정보 없으면 기본 제목
                    
                    Coverletter newCoverletter = Coverletter.builder()
                            .account(Account.builder()
                                    .id(new AccountId(accountId))
                                    .build())
                            .recruitment(recruitment)
                            .title(new CoverletterTitle(defaultTitle))
                            .build();

                    // 4. Save coverletter
                    Coverletter savedCoverletter = saveCoverletterPort.save(newCoverletter);
                    
                    // 5. Load questions for this recruitment
                    List<Question> questions = loadQuestionPort.findAllByRecruitmentId(recruitmentId);
                    
                    // 6. Create initial essay (version 1, empty) for each question
                    List<Essay> essays = questions.stream()
                            .map(question -> Essay.builder()
                                    .coverletter(savedCoverletter)
                                    .question(question)
                                    .content(new EssayContent(""))  // 빈 내용
                                    .version(new Version(1))
                                    .versionTitle(new VersionTitle("v1"))
                                    .isCurrent(new IsCurrent(true))
                                    .build())
                            .collect(Collectors.toList());
                    
                    // 7. Save all essays
                    if (!essays.isEmpty()) {
                        saveEssayPort.saveAll(essays);
                    }
                    
                    return CheckCoverletterResult.created(savedCoverletter.getId().value());
                });
    }
}
