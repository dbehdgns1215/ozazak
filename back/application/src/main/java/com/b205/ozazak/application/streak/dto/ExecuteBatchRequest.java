package com.b205.ozazak.application.streak.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExecuteBatchRequest {
    private LocalDate baseDate;
}
