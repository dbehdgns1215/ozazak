package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.CreateCommunityCommand;
import com.b205.ozazak.application.community.port.in.CreateCommunityUseCase;
import com.b205.ozazak.application.community.port.out.SaveCommunityPort;
import com.b205.ozazak.application.community.result.CreateCommunityResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.community.vo.CommunityCode;
import com.b205.ozazak.domain.community.vo.CommunityContent;
import com.b205.ozazak.domain.community.vo.CommunityTitle;
import com.b205.ozazak.domain.community.vo.CommunityType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateCommunityService implements CreateCommunityUseCase {

    private final SaveCommunityPort saveCommunityPort;

    @Override
    public CreateCommunityResult create(CreateCommunityCommand command) {
        // Convert code to domain type (validates the code)
        CommunityType type = CommunityType.fromCode(command.communityCode());
        
        // Business rule: tags only allowed for TIL posts
        if (!type.allowsTags() && !command.tags().isEmpty()) {
            throw new IllegalArgumentException("Tags are only allowed for TIL posts");
        }

        // Create minimal Account with just ID (we only need the reference)
        Account author = Account.builder()
                .id(new AccountId(command.accountId()))
                .build();

        // Create Community domain entity
        Community community = Community.create(
                author,
                new CommunityCode(command.communityCode()),
                new CommunityTitle(command.title()),
                new CommunityContent(command.content()),
                command.tags()
        );

        // Save and return result
        Long communityId = saveCommunityPort.save(community);
        return new CreateCommunityResult(communityId);
    }
}
