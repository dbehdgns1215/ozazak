package com.b205.ozazak.presentation.activity.read;

import com.b205.ozazak.application.activity.result.GetUserAwardsResult;
import com.b205.ozazak.application.activity.service.GetUserAwardsService;
import com.b205.ozazak.presentation.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users/{userId}/awards")
@RequiredArgsConstructor
@Tag(name = "Award", description = "Award Management API")
public class GetUserAwardsController {

    private final GetUserAwardsService getUserAwardsService;

    @Operation(summary = "Get user awards list")
    @GetMapping
    public ResponseEntity<ApiResponse<GetUserAwardsResponse>> getUserAwards(
            @PathVariable Long userId) {
        
        GetUserAwardsResult result = getUserAwardsService.execute(userId);
        
        GetUserAwardsResponse response = new GetUserAwardsResponse(
                result.userId(),
                result.awards().stream()
                        .map(award -> new AwardResponseDto(
                                award.awardId(),
                                award.title(),
                                award.rankName(),
                                award.organization(),
                                award.awardedAt()
                        ))
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(ApiResponse.success("수상 조회 성공", response));
    }
}
