package com.b205.ozazak.application.auth.port.in;

public interface PasswordUseCase {

    void requestPasswordReset(String email);

    void resetPassword(String email, String token, String newPassword);
}
