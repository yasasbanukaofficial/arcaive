package tech.yasasbanuka.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.yasasbanuka.backend.dto.cv.TailoredCVRequestDTO;
import tech.yasasbanuka.backend.dto.member.MemberProfileDTO;
import tech.yasasbanuka.backend.service.TailoredCVService;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/cv")
public class TailoredCVController {
    private final TailoredCVService tailoredCVService;

    @PostMapping("/tailor")
    public ResponseEntity<MemberProfileDTO> tailorCV(Authentication authentication, @RequestBody TailoredCVRequestDTO request) {
        return ResponseEntity.ok(tailoredCVService.tailorCV(authentication.getName(), request));
    }
}
