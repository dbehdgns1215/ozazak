package com.b205.ozazak.application.essay.port.out;

import com.b205.ozazak.domain.essay.entity.Essay;

import java.util.List;

public interface LoadEssayPort {
    List<Essay> findAllByCoverletterId(Long coverletterId);
}
