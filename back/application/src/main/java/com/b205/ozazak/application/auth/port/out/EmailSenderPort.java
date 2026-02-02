package com.b205.ozazak.application.auth.port.out;

public interface EmailSenderPort {
    void sendVerificationCode(String email, String code);

    void sendPasswordResetEmail(String email, String resetToken);
}
