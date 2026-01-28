package com.b205.ozazak.infra.streak.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class StreakId implements Serializable {
    private Long accountId;
    private LocalDate activityDate;
}
