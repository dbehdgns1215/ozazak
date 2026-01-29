package com.b205.ozazak.application.essay.port.out;

public interface DeleteEssayPort {
    void deleteById(Long essayId);
    int deleteAllByCoverletterId(Long coverletterId);  // ← 추가 (삭제된 개수 반환)
}
