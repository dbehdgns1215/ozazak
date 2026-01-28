package com.b205.ozazak.application.essay.port.out;

import com.b205.ozazak.domain.essay.entity.Essay;

import java.util.List;

public interface SaveEssayPort {
    List<Essay> saveAll(List<Essay> essays);
}
