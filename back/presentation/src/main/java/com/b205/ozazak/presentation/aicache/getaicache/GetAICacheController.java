package com.b205.ozazak.presentation.aicache.getaicache;

import com.b205.ozazak.application.aicache.command.GetAnalysisCacheCommand;
import com.b205.ozazak.application.aicache.port.in.GetAnalysisCacheUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/job-postings/analysis-cache/lookup")
@RequiredArgsConstructor
public class GetAICacheController {

    private final GetAnalysisCacheUseCase getAnalysisCacheUseCase;

    @PostMapping
    public ResponseEntity<GetAICacheResponse> getAnalysisCache(@RequestBody GetAICacheRequest request) {
        GetAnalysisCacheCommand command = GetAnalysisCacheCommand.builder()
                .companyName(request.getCompanyName())
                .position(request.getPosition())
                .jobPosting(request.getJobPosting())
                .build();

        Map<String, Object> result = getAnalysisCacheUseCase.getAnalysisCache(command);
        return ResponseEntity.ok(GetAICacheResponse.from(result));
    }
}
