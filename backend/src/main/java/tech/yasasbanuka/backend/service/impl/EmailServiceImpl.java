package tech.yasasbanuka.backend.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.service.EmailService;

import java.io.File;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendVerificationCode(String to, String code) {
        log.info("Sending HTML verification code to email: {}", to);
        String subject = "Verify your Arcaive account";
        
        String htmlBody = """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', sans-serif; background-color: #070707; color: #f5f5f5; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #111111; border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; overflow: hidden; }
                    .header { padding: 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
                    .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.2em; color: #f5f5f5; font-weight: 700; text-transform: uppercase; }
                    .content { padding: 40px; text-align: center; }
                    .description { font-size: 16px; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 32px; }
                    .code-container { background-color: rgba(223, 231, 216, 0.05); border: 1px dashed #dfe7d8; border-radius: 12px; padding: 24px; margin: 24px 0; }
                    .code { font-size: 36px; font-weight: 700; letter-spacing: 0.25em; color: #dfe7d8; }
                    .footer { padding: 24px; text-align: center; font-size: 12px; color: rgba(255,255,255,0.3); border-top: 1px solid rgba(255,255,255,0.06); }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ARCAIVE</h1>
                    </div>
                    <div class="content">
                        <div class="description">
                            Welcome to the future of voice identity. Use the verification code below to complete your registration and harness invisible power.
                        </div>
                        <div class="code-container">
                            <div class="code">%s</div>
                        </div>
                        <div class="description" style="font-size: 14px; margin-top: 32px;">
                            This code will expire in 10 minutes. If you didn't request this, please ignore this email.
                        </div>
                    </div>
                    <div class="footer">
                        &copy; 2026 Arcaive Labs. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            """.formatted(code);

        try {
            sendHtml(to, subject, htmlBody);
            log.info("HTML verification code sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
            // Fallback to simple mail if HTML fails
            sendSimple(to, subject, "Your verification code is: " + code);
        }
    }

    @Override
    public void sendSimple(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("Arcaive <" + fromEmail + ">");
        mailSender.send(message);
    }

    @Override
    public void sendHtml(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            helper.setFrom(fromEmail, "Arcaive");
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to set HTML email properties: {}", e.getMessage());
            throw new MessagingException("Failed to send HTML email", e);
        }
    }

    @Override
    public void sendWithAttachment(String to, String subject, String body, File file) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            helper.addAttachment(file.getName(), file);
            helper.setFrom(fromEmail, "Arcaive");
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to set attachment email properties: {}", e.getMessage());
            throw new MessagingException("Failed to send email with attachment", e);
        }
    }
}
