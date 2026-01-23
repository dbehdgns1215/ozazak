package com.b205.ozazak.infra.auth.adapter;

import com.b205.ozazak.application.auth.port.out.EmailSenderPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class JavaMailSenderAdapter implements EmailSenderPort {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationCode(String email, String code) {
        log.info("Sending verification code {} to {}", code, email);
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[Ozazak] Email Verification Code");
        message.setText("Your verification code is: " + code + "\nValid for 5 minutes.");
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}", email, e);
            // In development, we might not want to throw and block the flow if SMTP is not configured
            // but for production-safe code, we should probably let it bubble up if it's a hard requirement.
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
}
