package com.b205.ozazak.application.essay.port.out;

import com.b205.ozazak.domain.essay.entity.Essay;

import java.util.List;
import java.util.Optional;

public interface LoadEssayPort {
    List<Essay> findAllByCoverletterId(Long coverletterId);
    Optional<Essay> findById(Long essayId);
}
