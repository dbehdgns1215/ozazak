package com.b205.ozazak.application.coverletter.service;

import com.b205.ozazak.application.coverletter.command.CheckCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.CheckCoverletterUseCase;
import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
import com.b205.ozazak.application.coverletter.port.out.SaveCoverletterPort;
import com.b205.ozazak.application.coverletter.result.CheckCoverletterResult;
import com.b205.ozazak.application.recruitment.port.out.LoadRecruitmentPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.coverletter.vo.CoverletterTitle;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CheckCoverletterService implements CheckCoverletterUseCase {

    private final LoadCoverletterPort loadCoverletterPort;
    private final LoadRecruitmentPort loadRecruitmentPort;
    private final SaveCoverletterPort saveCoverletterPort;

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
                    String defaultTitle = recruitment.getCompany().getName().value() + " 자소서";
                    
                    Coverletter newCoverletter = Coverletter.builder()
                            .account(Account.builder()
                                    .id(new AccountId(accountId))
                                    .build())
                            .recruitment(recruitment)
                            .title(new CoverletterTitle(defaultTitle))
                            .build();

                    // 4. Save and return
                    Coverletter saved = saveCoverletterPort.save(newCoverletter);
                    return CheckCoverletterResult.created(saved.getId().value());
                });
    }
}
