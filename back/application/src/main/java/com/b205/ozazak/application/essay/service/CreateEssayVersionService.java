package com.b205.ozazak.application.essay.service;

import com.b205.ozazak.application.essay.command.CreateEssayVersionCommand;
import com.b205.ozazak.application.essay.port.in.CreateEssayVersionUseCase;
import com.b205.ozazak.application.essay.port.out.LoadEssayPort;
import com.b205.ozazak.application.essay.port.out.SaveEssayPort;
import com.b205.ozazak.application.essay.result.CreateEssayVersionResult;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.essay.vo.EssayContent;
import com.b205.ozazak.domain.essay.vo.IsCurrent;
import com.b205.ozazak.domain.essay.vo.Version;
import com.b205.ozazak.domain.essay.vo.VersionTitle;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateEssayVersionService implements CreateEssayVersionUseCase {

    private final LoadEssayPort loadEssayPort;
    private final SaveEssayPort saveEssayPort;

    @Override
    public CreateEssayVersionResult execute(CreateEssayVersionCommand command) {
        // 1. 기반 Essay 조회
        Essay baseEssay = loadEssayPort.findById(command.getBaseEssayId())
                .orElseThrow(() -> new IllegalArgumentException("Essay not found: " + command.getBaseEssayId()));

        // 2. 소유권 검증
        validateOwnership(baseEssay, command.getAccountId());

        // 3. 같은 Coverletter + Question의 모든 Essay 조회
        List<Essay> allEssays = loadEssayPort.findAllByCoverletterIdAndQuestionId(
                baseEssay.getCoverletter().getId().value(),
                baseEssay.getQuestion().getId().value()
        );

        // 4. 최대 버전 찾기
        int maxVersion = allEssays.stream()
                .map(e -> e.getVersion().value())
                .max(Integer::compare)
                .orElse(0);

        int newVersion = maxVersion + 1;

        // 5. 기존 isCurrent=true인 Essay들을 false로 변경
        List<Essay> currentEssays = allEssays.stream()
                .filter(e -> e.getIsCurrent().value())
                .map(e -> Essay.builder()
                        .id(e.getId())
                        .coverletter(e.getCoverletter())
                        .question(e.getQuestion())
                        .content(e.getContent())
                        .version(e.getVersion())
                        .versionTitle(e.getVersionTitle())
                        .isCurrent(new IsCurrent(false))  // ← false로 변경
                        .deletedAt(e.getDeletedAt())
                        .build())
                .collect(Collectors.toList());

        // 6. 새 Essay 생성
        String versionTitle = command.getVersionTitle() != null
                ? command.getVersionTitle()
                : "v" + newVersion;

        Essay newEssay = Essay.builder()
                .coverletter(baseEssay.getCoverletter())
                .question(baseEssay.getQuestion())
                .content(new EssayContent(command.getContent()))
                .version(new Version(newVersion))
                .versionTitle(new VersionTitle(versionTitle))
                .isCurrent(new IsCurrent(true))
                .build();

        // 7. 일괄 저장 (기존 업데이트 + 새 Essay)
        List<Essay> toSave = new ArrayList<>();
        toSave.addAll(currentEssays);
        toSave.add(newEssay);

        List<Essay> saved = saveEssayPort.saveAll(toSave);
        Essay savedNew = saved.get(saved.size() - 1);

        // 8. Result 반환
        return CreateEssayVersionResult.builder()
                .essayId(savedNew.getId().value())
                .version(savedNew.getVersion().value())
                .versionTitle(savedNew.getVersionTitle().value())
                .content(savedNew.getContent().value())
                .baseEssayId(command.getBaseEssayId())
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
