package com.b205.ozazak.infra.auth.adapter;

import com.b205.ozazak.application.auth.port.out.EmailSenderPort;
import com.b205.ozazak.infra.config.AppProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class JavaMailSenderAdapter implements EmailSenderPort {

    private final JavaMailSender mailSender;
    private final AppProperties appProperties;

    @Override
    public void sendVerificationCode(String email, String code) {
        log.debug("Sending verification code to {}", email);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("[Ozazak] 이메일 인증 코드");
            helper.setText(buildVerificationEmailContent(code), true);
            helper.setFrom("yudonghuntube@gmail.com", "Ozazak");

            mailSender.send(message);
            log.debug("Verification email sent successfully to {}", email);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send email to {}", email, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String email, String resetToken) {
        log.debug("Sending password reset email to {}", email);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("[Ozazak] 비밀번호 재설정");
            helper.setText(buildPasswordResetEmailContent(email, resetToken), true);
            helper.setFrom("yudonghuntube@gmail.com", "Ozazak");

            mailSender.send(message);
            log.debug("Password reset email sent successfully to {}", email);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send password reset email to {}", email, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    private String buildVerificationEmailContent(String code) {
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

    private String buildPasswordResetEmailContent(String email, String resetToken) {
        String resetLink = appProperties.getFrontendUrl() + "/password-reset?token=" 
            + URLEncoder.encode(resetToken, StandardCharsets.UTF_8) 
            + "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8);
        
        return """
                <!DOCTYPE html>
                <html lang="ko">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button-box { text-align: center; margin: 30px 0; }
                        .reset-button { background: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px; }
                        .reset-button:hover { background: #764ba2; }
                        .token-box { background: white; border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px; word-break: break-all; }
                        .token { font-size: 11px; font-family: monospace; color: #666; }
                        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Ozazak 비밀번호 재설정</h1>
                        </div>
                        <div class="content">
                            <p>안녕하세요!</p>
                            <p>비밀번호를 재설정하기 위한 요청이 접수되었습니다.</p>
                            
                            <div class="button-box">
                                <a href="%s" class="reset-button">비밀번호 재설정</a>
                            </div>
                            
                            <p style="color: #e74c3c; font-weight: bold;">⏰ 이 링크는 10분 동안만 유효합니다.</p>
                            
                            <p style="color: #666; margin-top: 30px;">이 요청을 하지 않았다면, 이 메일을 무시하세요. 다른 누군가가 당신의 계정에 접근하려고 시도했을 가능성이 있습니다.</p>
                            
                            <div class="footer">
                                <p>&copy; 2026 Ozazak. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(resetLink, resetLink);
    }

    private String buildEmailContent(String code) {
        return buildVerificationEmailContent(code);
    }
}