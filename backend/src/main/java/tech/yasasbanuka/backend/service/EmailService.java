package tech.yasasbanuka.backend.service;

import jakarta.mail.MessagingException;
import java.io.File;

public interface EmailService {
    void sendVerificationCode(String to, String code);
    void sendSimple(String to, String subject, String body);
    void sendHtml(String to, String subject, String htmlBody) throws MessagingException;
    void sendWithAttachment(String to, String subject, String body, File file) throws MessagingException;
}
