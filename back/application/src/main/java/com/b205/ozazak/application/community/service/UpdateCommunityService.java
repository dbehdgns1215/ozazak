package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.UpdateCommunityCommand;
import com.b205.ozazak.application.community.command.UpdateCommunityParams;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.in.UpdateCommunityUseCase;
import com.b205.ozazak.application.community.port.out.dto.CommunityAuthorProjection;
import com.b205.ozazak.application.community.port.out.LoadCommunityForUpdatePort;
import com.b205.ozazak.application.community.port.out.UpdateCommunityPort;
import com.b205.ozazak.application.community.result.UpdateCommunityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateCommunityService implements UpdateCommunityUseCase {

    private final LoadCommunityForUpdatePort loadCommunityPort;
    private final UpdateCommunityPort updateCommunityPort;

    @Override
    public UpdateCommunityResult update(UpdateCommunityCommand command) {
        // 1. Business Rule Validation
        validateTags(command.getCommunityCode(), command.getTags() != null && !command.getTags().isEmpty());

        // 2. Load Community Author
        CommunityAuthorProjection community = loadCommunityPort.loadForUpdate(command.getCommunityId());

        // 3. Check Existence
        if (community == null) {
            throw new CommunityException(CommunityErrorCode.NOT_FOUND);
        }

        // 4. Check Authorization
        if (!community.getAuthorId().equals(command.getAccountId())) {
            throw new CommunityException(CommunityErrorCode.FORBIDDEN);
        }

        // 5. Map Command to Params (Primitive-only for Port)
        UpdateCommunityParams params = UpdateCommunityParams.builder()
                .communityCode(command.getCommunityCode())
                .title(command.getTitle())
                .content(command.getContent())
                .tags(command.getTags())
                .build();

        // 6. Update Community
        updateCommunityPort.update(command.getCommunityId(), params);

        return new UpdateCommunityResult(command.getCommunityId());
    }

    private void validateTags(Integer communityCode, boolean hasTags) {
        // TIL (code 1) allows tags. Others do not.
        if (communityCode != 1 && hasTags) {
            throw new CommunityException(CommunityErrorCode.BAD_REQUEST); // Detailed message can be improved if needed
        }
    }
}
