package com.b205.ozazak.application.coverletter.service;

import com.b205.ozazak.application.coverletter.command.DeleteCoverletterCommand;
import com.b205.ozazak.application.coverletter.port.in.DeleteCoverletterUseCase;
import com.b205.ozazak.application.coverletter.port.out.LoadCoverletterPort;
import com.b205.ozazak.application.coverletter.port.out.SaveCoverletterPort;
import com.b205.ozazak.application.coverletter.result.DeleteCoverletterResult;
import com.b205.ozazak.application.essay.port.out.DeleteEssayPort;
import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class DeleteCoverletterService implements DeleteCoverletterUseCase {

    private final LoadCoverletterPort loadCoverletterPort;
    private final SaveCoverletterPort saveCoverletterPort;
    private final DeleteEssayPort deleteEssayPort;

    @Override
    public DeleteCoverletterResult execute(DeleteCoverletterCommand command) {
        // 1. Coverletter 조회
        Coverletter coverletter = loadCoverletterPort.findById(command.getCoverletterId())
                .orElseThrow(() -> new IllegalArgumentException("Coverletter not found: " + command.getCoverletterId()));

        // 2. 소유권 검증
        validateOwnership(coverletter, command.getAccountId());

        // 3. 관련 Essay 전체 Batch Hard Delete (Cascade)
        int deletedEssayCount = deleteEssayPort.deleteAllByCoverletterId(command.getCoverletterId());

        // 4. Coverletter Soft Delete
        coverletter.softDelete();
        saveCoverletterPort.save(coverletter);

        // 5. Result 반환
        return DeleteCoverletterResult.builder()
                .deletedCoverletterId(command.getCoverletterId())
                .deletedEssayCount(deletedEssayCount)
                .build();
    }

    private void validateOwnership(Coverletter coverletter, Long accountId) {
        Long ownerId = coverletter.getAccount().getId().value();
        if (!ownerId.equals(accountId)) {
            throw new IllegalArgumentException("Access denied: Coverletter does not belong to this account");
        }
    }
}
