package com.b205.ozazak.application.essay.service;

import com.b205.ozazak.application.essay.command.DeleteEssayCommand;
import com.b205.ozazak.application.essay.port.in.DeleteEssayUseCase;
import com.b205.ozazak.application.essay.port.out.DeleteEssayPort;
import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.application.essay.result.DeleteEssayResult;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.IsCurrent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DeleteEssayService implements DeleteEssayUseCase {

    private final LoadEssayPort loadEssayPort;
    private final DeleteEssayPort deleteEssayPort;
    private final SaveEssayPort saveEssayPort;

    @Override
    public DeleteEssayResult execute(DeleteEssayCommand command) {
        // 1. Essay 조회
        Essay essayToDelete = loadEssayPort.findById(command.getEssayId())
                .orElseThrow(() -> new IllegalArgumentException("Essay not found: " + command.getEssayId()));

        // 2. 소유권 검증
        validateOwnership(essayToDelete, command.getAccountId());

        // 3. 삭제할 Essay의 정보 저장 (삭제 후 필요)
        Long coverletterId = essayToDelete.getCoverletter().getId().value();
        Long questionId = essayToDelete.getQuestion().getId().value();
        boolean wasCurrentVersion = essayToDelete.getIsCurrent().value();

        // 4. Hard Delete 실행
        deleteEssayPort.deleteById(command.getEssayId());

        // 5. 삭제한 essay가 isCurrent였다면, 남은 버전 중 최신 버전을 isCurrent로 설정
        if (wasCurrentVersion) {
            updateCurrentVersion(coverletterId, questionId);
        }

        // 6. 삭제된 ID 반환
        return DeleteEssayResult.builder()
                .deletedEssayId(command.getEssayId())
                .build();
    }

    private void validateOwnership(Essay essay, Long accountId) {
        Long ownerId = essay.getCoverletter().getAccount().getId().value();
        if (!ownerId.equals(accountId)) {
            throw new IllegalArgumentException("Access denied: Essay does not belong to this account");
        }
    }

    private void updateCurrentVersion(Long coverletterId, Long questionId) {
        // 같은 coverletter + question의 남은 essays 조회
        List<Essay> remainingEssays = loadEssayPort.findAllByCoverletterIdAndQuestionId(coverletterId, questionId);

        if (!remainingEssays.isEmpty()) {
            // 가장 최신 버전 찾기 (version 번호가 가장 큰 것)
            Essay latestVersion = remainingEssays.stream()
                    .max(Comparator.comparing(e -> e.getVersion().value()))
                    .orElseThrow();

            // 최신 버전을 isCurrent=true로 업데이트
            Essay updatedEssay = Essay.builder()
                    .id(latestVersion.getId())
                    .coverletter(latestVersion.getCoverletter())
                    .question(latestVersion.getQuestion())
                    .content(latestVersion.getContent())
                    .version(latestVersion.getVersion())
                    .versionTitle(latestVersion.getVersionTitle())
                    .isCurrent(new IsCurrent(true))  // ← isCurrent true로 설정
                    .deletedAt(latestVersion.getDeletedAt())
                    .build();

            saveEssayPort.save(updatedEssay);
        }
        // remainingEssays가 비어있으면 (마지막 essay 삭제) 아무것도 안 함
    }
}
