package com.b205.ozazak.application.auth.port.in;

public interface EmailVerificationUseCase {
    void requestVerification(String email);
    String confirmVerification(String email, String code);
    boolean verifyToken(String email, String token);
}
