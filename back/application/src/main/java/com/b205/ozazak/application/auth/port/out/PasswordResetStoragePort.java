package com.b205.ozazak.application.auth.port.out;

public interface PasswordResetStoragePort {
    
    void storeResetToken(String email, String token);

    boolean verifyResetToken(String email, String token);
    
    void deleteResetToken(String email);
    
    boolean hasCooldown(String email);

    void saveCooldown(String email, int seconds);
}
