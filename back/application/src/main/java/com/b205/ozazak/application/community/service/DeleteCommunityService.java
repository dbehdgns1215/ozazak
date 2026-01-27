package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.command.DeleteCommunityCommand;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import com.b205.ozazak.application.community.port.in.DeleteCommunityUseCase;
import com.b205.ozazak.application.community.port.out.CommunityDeleteProjection;
import com.b205.ozazak.application.community.port.out.DeleteCommunityPort;
import com.b205.ozazak.application.community.port.out.LoadCommunityForDeletePort;
import com.b205.ozazak.application.community.result.DeleteCommunityResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DeleteCommunityService implements DeleteCommunityUseCase {

    private final LoadCommunityForDeletePort loadCommunityForDeletePort;
    private final DeleteCommunityPort deleteCommunityPort;

    @Override
    public DeleteCommunityResult delete(DeleteCommunityCommand command) {
        // 1. Load metadata for authorization check
        CommunityDeleteProjection projection = loadCommunityForDeletePort.loadForDelete(command.getCommunityId());
        
        // 2. Check existence and deletion status
        if (projection == null || projection.getDeletedAt() != null) {
            throw new CommunityException(CommunityErrorCode.NOT_FOUND);
        }
        
        // 3. Authorization check: author or admin
        Long authorId = projection.getAuthorId();
        boolean isAuthor = authorId.equals(command.getAccountId());
        
        if (!command.isAdmin() && !isAuthor) {
            throw new CommunityException(CommunityErrorCode.FORBIDDEN);
        }
        
        // 4. Log admin delete for observability
        if (command.isAdmin() && !isAuthor) {
            log.warn("Admin delete: communityId={}, adminAccountId={}", 
                    command.getCommunityId(), command.getAccountId());
        }
        
        // 5. Execute soft delete (DB-level UPDATE)
        deleteCommunityPort.delete(command.getCommunityId());
        
        return new DeleteCommunityResult(command.getCommunityId());
    }
}
