package com.b205.ozazak.application.community.port.out;

public interface LoadTilExistencePort {
    /**
     * Check if a TIL exists, is active (not deleted), and has correct community code.
     * @param tilId Target TIL ID
     * @return true if exists and valid
     */
    boolean existsActiveTil(Long tilId);
}
