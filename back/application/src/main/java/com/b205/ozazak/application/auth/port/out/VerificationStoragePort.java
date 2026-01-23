package com.b205.ozazak.application.auth.port.out;

import java.util.Optional;

public interface VerificationStoragePort {
    void saveCode(String emailSalt, String code, long ttlMinutes);
    Optional<String> getCode(String emailSalt);
    void deleteCode(String emailSalt);
    
    void saveCooldown(String emailSalt, long ttlSeconds);
    boolean hasCooldown(String emailSalt);
    
    long incrementAttempts(String emailSalt, long ttlMinutes);
    void deleteAttempts(String emailSalt);
    
    void saveVerifiedToken(String emailSalt, String token, long ttlMinutes);
    Optional<String> getVerifiedToken(String emailSalt);
    void deleteVerifiedToken(String emailSalt);
}
