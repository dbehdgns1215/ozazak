package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.UpdateCommunityCommand;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.in.UpdateCommunityUseCase;
import com.b205.ozazak.application.community.port.out.LoadCommunityPort;
import com.b205.ozazak.application.community.port.out.SaveCommunityPort;
import com.b205.ozazak.application.community.result.UpdateCommunityResult;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.community.vo.CommunityContent;
import com.b205.ozazak.domain.community.vo.CommunityTitle;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateCommunityService implements UpdateCommunityUseCase {

    private final LoadCommunityPort loadCommunityPort;
    private final SaveCommunityPort saveCommunityPort;

    @Override
    public UpdateCommunityResult update(UpdateCommunityCommand command) {
        // 1. Load Community Entity
        Community community = loadCommunityPort.loadCommunity(command.getCommunityId())
                .orElseThrow(() -> new CommunityException(CommunityErrorCode.NOT_FOUND));

        // 2. Check Authorization
        // Note: Domain Account ID comparison. Assuming AccountId implements equals.
        // AccountId is a record or class with equals? It's a VO.
        // command.getAccountId() is Long.
        // community.getAuthor().getId() is AccountId.
        if (!community.getAuthor().getId().equals(new AccountId(command.getAccountId()))) {
            throw new CommunityException(CommunityErrorCode.FORBIDDEN);
        }

        // 3. Domain Update (Validation happens here)
        Community updatedCommunity = community.update(
                new CommunityTitle(command.getTitle()),
                new CommunityContent(command.getContent()),
                command.getTags()
        );

        // 4. Persist Changes
        saveCommunityPort.save(updatedCommunity);

        return new UpdateCommunityResult(command.getCommunityId());
    }
}
