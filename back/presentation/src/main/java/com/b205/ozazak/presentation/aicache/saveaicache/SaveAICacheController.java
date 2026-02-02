package com.b205.ozazak.presentation.aicache.saveaicache;

import com.b205.ozazak.application.aicache.command.SaveAnalysisCacheCommand;
import com.b205.ozazak.application.aicache.port.in.SaveAnalysisCacheUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/job-postings/analysis-cache")
@RequiredArgsConstructor
public class SaveAICacheController {

    private final SaveAnalysisCacheUseCase saveAnalysisCacheUseCase;

    @PutMapping
    public ResponseEntity<SaveAICacheResponse> saveAnalysisCache(@RequestBody SaveAICacheRequest request) {
        SaveAnalysisCacheCommand command = SaveAnalysisCacheCommand.builder()
                .companyName(request.getCompanyName())
                .recruitmentTitle(request.getRecruitmentTitle())
                .recruitmentContent(request.getRecruitmentContent())
                .startedAt(request.getStartedAt())
                .endedAt(request.getEndedAt())
                .analysis(request.getAnalysis())
                .build();

        Map<String, Object> result = saveAnalysisCacheUseCase.saveAnalysisCache(command);
        return ResponseEntity.ok(SaveAICacheResponse.from(result));
    }
}
