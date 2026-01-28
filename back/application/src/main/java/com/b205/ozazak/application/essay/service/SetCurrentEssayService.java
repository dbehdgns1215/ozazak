package com.b205.ozazak.application.essay.service;

import com.b205.ozazak.application.essay.command.SetCurrentEssayCommand;
import com.b205.ozazak.application.essay.port.in.SetCurrentEssayUseCase;
import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.application.essay.result.SetCurrentEssayResult;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.IsCurrent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SetCurrentEssayService implements SetCurrentEssayUseCase {

    private final LoadEssayPort loadEssayPort;
    private final SaveEssayPort saveEssayPort;

    @Override
    public SetCurrentEssayResult execute(SetCurrentEssayCommand command) {
        // 1. Target Essay 조회 (새로 current로 설정할 essay)
        Essay targetEssay = loadEssayPort.findById(command.getTargetEssayId())
                .orElseThrow(() -> new IllegalArgumentException("Essay not found: " + command.getTargetEssayId()));

        // 2. 소유권 검증
        validateOwnership(targetEssay, command.getAccountId());

        // 3. 업데이트할 essays 리스트
        List<Essay> toUpdate = new ArrayList<>();

        // 4. Previous Current Essay가 있으면 isCurrent=false로 변경
        if (command.getPreviousCurrentEssayId() != null) {
            Essay previousCurrent = loadEssayPort.findById(command.getPreviousCurrentEssayId())
                    .orElseThrow(() -> new IllegalArgumentException("Previous current essay not found: " 
                            + command.getPreviousCurrentEssayId()));

            // 같은 question인지 검증 (데이터 정합성)
            if (!previousCurrent.getQuestion().getId().value()
                    .equals(targetEssay.getQuestion().getId().value())) {
                throw new IllegalArgumentException("Previous essay belongs to different question");
            }

            Essay updatedPrevious = Essay.builder()
                    .id(previousCurrent.getId())
                    .coverletter(previousCurrent.getCoverletter())
                    .question(previousCurrent.getQuestion())
                    .content(previousCurrent.getContent())
                    .version(previousCurrent.getVersion())
                    .versionTitle(previousCurrent.getVersionTitle())
                    .isCurrent(new IsCurrent(false))  // ← false로 변경
                    .deletedAt(previousCurrent.getDeletedAt())
                    .build();

            toUpdate.add(updatedPrevious);
        }

        // 5. Target Essay를 isCurrent=true로 변경
        Essay updatedTarget = Essay.builder()
                .id(targetEssay.getId())
                .coverletter(targetEssay.getCoverletter())
                .question(targetEssay.getQuestion())
                .content(targetEssay.getContent())
                .version(targetEssay.getVersion())
                .versionTitle(targetEssay.getVersionTitle())
                .isCurrent(new IsCurrent(true))  // ← true로 변경
                .deletedAt(targetEssay.getDeletedAt())
                .build();

        toUpdate.add(updatedTarget);

        // 6. 최적화된 업데이트 (최대 2개)
        saveEssayPort.saveAll(toUpdate);

        // 7. Result 반환
        return SetCurrentEssayResult.builder()
                .currentEssayId(command.getTargetEssayId())
                .version(targetEssay.getVersion().value())
                .build();
    }

    private void validateOwnership(Essay essay, Long accountId) {
        Long ownerId = essay.getCoverletter().getAccount().getId().value();
        if (!ownerId.equals(accountId)) {
            throw new IllegalArgumentException("Access denied: Essay does not belong to this account");
        }
    }
}
