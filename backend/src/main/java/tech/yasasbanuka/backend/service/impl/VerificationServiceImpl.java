package tech.yasasbanuka.backend.service.impl;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.member.MemberCreateRequestDTO;
import tech.yasasbanuka.backend.service.VerificationService;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationServiceImpl implements VerificationService {

    private final Map<String, VerificationData> storage = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    @Data
    @AllArgsConstructor
    private static class VerificationData {
        private String code;
        private MemberCreateRequestDTO registrationData;
        private Instant expiry;
    }

    @Override
    public String generateCode(String email, MemberCreateRequestDTO registrationData) {
        String code = String.format("%06d", random.nextInt(1000000));
        Instant expiry = Instant.now().plusSeconds(600); // 10 minutes
        storage.put(email, new VerificationData(code, registrationData, expiry));
        return code;
    }

    @Override
    public boolean verifyCode(String email, String code) {
        VerificationData data = storage.get(email);
        if (data == null) {
            return false;
        }
        if (Instant.now().isAfter(data.getExpiry())) {
            storage.remove(email);
            return false;
        }
        return data.getCode().equals(code);
    }

    @Override
    public MemberCreateRequestDTO getRegistrationData(String email) {
        VerificationData data = storage.get(email);
        return (data != null) ? data.getRegistrationData() : null;
    }

    @Override
    public void clearVerification(String email) {
        storage.remove(email);
    }

    @Scheduled(fixedRate = 60000) // Every minute
    public void cleanupExpiredEntries() {
        Instant now = Instant.now();
        storage.entrySet().removeIf(entry -> now.isAfter(entry.getValue().getExpiry()));
    }
}
