package com.b205.ozazak.infra.auth.adapter;

import com.b205.ozazak.application.auth.port.out.EmailSenderPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.UnsupportedEncodingException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JavaMailSenderAdapter implements EmailSenderPort {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationCode(String email, String code) {
        log.debug("Sending verification code to {}", email);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("[Ozazak] 이메일 인증 코드");
            helper.setText(buildEmailContent(code), true);
            helper.setFrom("yudonghuntube@gmail.com", "Ozazak");

            mailSender.send(message);
            log.debug("Verification email sent successfully to {}", email);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send email to {}", email, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private String buildEmailContent(String code) {
        // 주의: String.format()을 쓸 때 CSS의 %는 %%로 이스케이프 해야 합니다.
        return """
                <!DOCTYPE html>
                <html lang="ko">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        /* 아래 줄 수정됨: 0%%, 100%% */
                        .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .code-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
                        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
                        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Ozazak 이메일 인증</h1>
                        </div>
                        <div class="content">
                            <p>안녕하세요!</p>
                            <p>Ozazak 회원가입을 위한 인증 코드를 아래에서 확인하세요.</p>
                            
                            <div class="code-box">
                                <p style="margin: 0; color: #999; font-size: 12px;">인증 코드</p>
                                <div class="code">%s</div>
                            </div>
                            
                            <p style="color: #e74c3c; font-weight: bold;">⏰ 이 코드는 5분 동안만 유효합니다.</p>
                            
                            <p>위 코드를 앱에 입력하여 이메일 인증을 완료하세요.</p>
                            
                            <div class="footer">
                                <p>이 이메일을 요청하지 않았다면, 이 메일을 무시하세요.</p>
                                <p>&copy; 2026 Ozazak. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(code);
    }
}