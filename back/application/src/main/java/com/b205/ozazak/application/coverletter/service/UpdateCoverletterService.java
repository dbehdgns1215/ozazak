package com.b205.ozazak.application.coverletter.service;

import com.b205.ozazak.application.coverletter.command.UpdateCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.UpdateCoverletterUseCase;
import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
import com.b205.ozazak.application.coverletter.port.out.SaveCoverletterPort;
import com.b205.ozazak.application.coverletter.result.UpdateCoverletterResult;
import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.coverletter.vo.CoverletterTitle;
import com.b205.ozazak.domain.coverletter.vo.IsComplete;
import com.b205.ozazak.domain.coverletter.vo.IsPassed;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.EssayContent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateCoverletterService implements UpdateCoverletterUseCase {

    private final LoadCoverletterPort loadCoverletterPort;
    private final SaveCoverletterPort saveCoverletterPort;
    private final LoadEssayPort loadEssayPort;
    private final SaveEssayPort saveEssayPort;

    @Override
    public UpdateCoverletterResult execute(UpdateCoverletterCommand command) {
        // 1. Coverletter 조회
        Coverletter coverletter = loadCoverletterPort.findById(command.getCoverletterId())
                .orElseThrow(() -> new IllegalArgumentException("Coverletter not found: " + command.getCoverletterId()));

        // 2. 소유권 검증
        validateOwnership(coverletter, command.getAccountId());

        // 3. Coverletter 메타데이터 업데이트
        Coverletter updatedCoverletter = Coverletter.builder()
                .id(coverletter.getId())
                .account(coverletter.getAccount())
                .recruitment(coverletter.getRecruitment())
                .title(new CoverletterTitle(command.getTitle()))
                .isComplete(new IsComplete(command.getIsComplete()))
                .isPassed(new IsPassed(command.getIsPassed()))
                .createdAt(coverletter.getCreatedAt())
                .updatedAt(coverletter.getUpdatedAt())
                .deletedAt(coverletter.getDeletedAt())
                .build();

        saveCoverletterPort.save(updatedCoverletter);

        // 4. Essays 일괄 업데이트 (버전 생성 없이)
        List<Essay> updatedEssays = command.getEssays().stream()
                .map(essayData -> {
                    Essay essay = loadEssayPort.findById(essayData.getEssayId())
                            .orElseThrow(() -> new IllegalArgumentException("Essay not found: " + essayData.getEssayId()));

                    // Essay 소속 검증
                    if (!essay.getCoverletter().getId().value().equals(command.getCoverletterId())) {
                        throw new IllegalArgumentException("Essay does not belong to this coverletter");
                    }

                    return Essay.builder()
                            .id(essay.getId())
                            .coverletter(essay.getCoverletter())
                            .question(essay.getQuestion())
                            .content(new EssayContent(essayData.getContent()))
                            .version(essay.getVersion())          // 유지
                            .versionTitle(essay.getVersionTitle())  // 유지
                            .isCurrent(essay.getIsCurrent())      // 유지
                            .deletedAt(essay.getDeletedAt())
                            .build();
                })
                .collect(Collectors.toList());

        saveEssayPort.saveAll(updatedEssays);

        // 5. Result 반환
        return UpdateCoverletterResult.builder()
                .coverletterId(command.getCoverletterId())
                .title(command.getTitle())
                .isComplete(command.getIsComplete())
                .isPassed(command.getIsPassed())
                .updatedEssayCount(updatedEssays.size())
                .build();
    }

    private void validateOwnership(Coverletter coverletter, Long accountId) {
        Long ownerId = coverletter.getAccount().getId().value();
        if (!ownerId.equals(accountId)) {
            throw new IllegalArgumentException("Access denied: Coverletter does not belong to this account");
        }
    }
}
