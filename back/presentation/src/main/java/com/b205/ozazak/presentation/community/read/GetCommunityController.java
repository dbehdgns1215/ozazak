package com.b205.ozazak.presentation.community.read;

import com.b205.ozazak.application.community.port.in.GetCommunityUseCase;
import com.b205.ozazak.application.community.result.GetCommunityResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Tag(name = "Community", description = "Community API")
public class GetCommunityController {

    private final GetCommunityUseCase getCommunityUseCase;

    @Operation(summary = "Get Community Detail")
    @GetMapping("/{communityId}")
    public ResponseEntity<CommunityResponse> getCommunity(@PathVariable Long communityId) {
        GetCommunityResult result = getCommunityUseCase.getCommunity(communityId);
        return ResponseEntity.ok(CommunityResponse.from(result));
    }
}
