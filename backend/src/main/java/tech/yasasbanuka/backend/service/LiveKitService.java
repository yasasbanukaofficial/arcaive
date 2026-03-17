package tech.yasasbanuka.backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;

public interface LiveKitService {
    Map<String, String> getToken(String username);
}
