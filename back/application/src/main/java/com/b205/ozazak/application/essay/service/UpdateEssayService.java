package com.b205.ozazak.application.essay.service;

import com.b205.ozazak.application.essay.command.UpdateEssayCommand;
import com.b205.ozazak.application.essay.port.in.UpdateEssayUseCase;
import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.application.essay.result.UpdateEssayResult;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.EssayContent;
import com.b205.ozazak.domain.essay.vo.IsCurrent;
import com.b205.ozazak.domain.essay.vo.Version;
import com.b205.ozazak.domain.essay.vo.VersionTitle;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateEssayService implements UpdateEssayUseCase {

    private final LoadEssayPort loadEssayPort;
    private final SaveEssayPort saveEssayPort;

    @Override
    public UpdateEssayResult execute(UpdateEssayCommand command) {
        // 1. 기존 Essay 조회
        Essay currentEssay = loadEssayPort.findById(command.getEssayId())
                .orElseThrow(() -> new IllegalArgumentException("Essay not found: " + command.getEssayId()));

        // 2. 소유권 검증
        validateOwnership(currentEssay, command.getAccountId());

        // 3. Essay content/versionTitle 업데이트 (단순 수정)
        Essay updatedEssay = Essay.builder()
                .id(currentEssay.getId())
                .coverletter(currentEssay.getCoverletter())
                .question(currentEssay.getQuestion())
                .content(new EssayContent(command.getContent()))  // ← 새 내용
                .version(currentEssay.getVersion())                // 동일
                .versionTitle(command.getVersionTitle() != null 
                        ? new VersionTitle(command.getVersionTitle())  // ← 새 제목
                        : currentEssay.getVersionTitle())              // 기존 유지
                .isCurrent(currentEssay.getIsCurrent())            // 동일
                .deletedAt(currentEssay.getDeletedAt())
                .build();

        // 4. 저장 (UPDATE만)
        List<Essay> saved = saveEssayPort.saveAll(List.of(updatedEssay));
        Essay savedEssay = saved.get(0);

        // 5. Result 반환
        return UpdateEssayResult.builder()
                .essayId(savedEssay.getId().value())
                .version(savedEssay.getVersion().value())
                .versionTitle(savedEssay.getVersionTitle().value())
                .content(savedEssay.getContent().value())
                .build();
    }

    private void validateOwnership(Essay essay, Long accountId) {
        // Essay → Coverletter → Account 경로로 소유권 확인
        Long ownerId = essay.getCoverletter().getAccount().getId().value();
        if (!ownerId.equals(accountId)) {
            throw new IllegalArgumentException("Access denied: Essay does not belong to this account");
        }
    }
}
