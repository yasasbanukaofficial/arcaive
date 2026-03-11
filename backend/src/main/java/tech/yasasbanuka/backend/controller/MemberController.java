package tech.yasasbanuka.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.dto.member.*;
import tech.yasasbanuka.backend.dto.skill.AtomicSkillResponseDTO;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.util.APIResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MemberController {
    private final MemberService memberservice;

    @GetMapping
    public ResponseEntity<APIResponse<List<MemberResponseDTO>>> getAllMembers() {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched all members successfully", memberservice.getAllMembers()), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<APIResponse<MemberResponseDTO>> getMember(Authentication authentication) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched member successfully", memberservice.getMemberByUsername(authentication.getName())), HttpStatus.OK);
    }

    @PostMapping("/upload-cv")
    public ResponseEntity<APIResponse<MemberInternalDTO>> extractMemberDetails(@RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.CREATED.value(), "Member created successfully", memberservice.extractMemberDetails(file)), HttpStatus.CREATED);
    }

    @PostMapping("/upload-cv/skills")
    public ResponseEntity<APIResponse<AtomicSkillResponseDTO>> extractAtomicSkills(@RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.CREATED.value(), "Skills extracted successfully", memberservice.extractAtomicSkillsFromCV(file)), HttpStatus.CREATED);
    }

    @PutMapping("/me")
    public ResponseEntity<APIResponse<MemberResponseDTO>> updateMember(Authentication authentication, @RequestBody @Valid MemberUpdateRequestDTO dto) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Member updated successfully", memberservice.updateMemberByUsername(authentication.getName(), dto)), HttpStatus.OK);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<APIResponse<Boolean>> deleteMember(@PathVariable UUID memberId) {
        memberservice.deleteMember(memberId);
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Member deleted successfully", null), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<APIResponse<MemberResponseDTO>> createMember(@RequestBody @Valid MemberCreateRequestDTO dto) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.CREATED.value(), "Member created successfully", memberservice.createMember(dto)), HttpStatus.CREATED);
    }

    @PatchMapping("/me/password")
    public ResponseEntity<APIResponse<Void>> changePassword(Authentication authentication, @RequestBody @Valid ChangePasswordDTO dto) {
        memberservice.changePassword(authentication.getName(), dto.getCurrentPassword(), dto.getNewPassword());
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Password updated successfully", null), HttpStatus.OK);
    }

    @PatchMapping("/me/mfa")
    public ResponseEntity<APIResponse<MemberResponseDTO>> updateMfa(Authentication authentication, @RequestBody @Valid MfaUpdateRequestDTO mfa) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "MFA settings updated successfully", memberservice.updateMfaByUsername(authentication.getName(), mfa)), HttpStatus.OK);
    }

    @PatchMapping("/me/linked-accounts")
    public ResponseEntity<APIResponse<MemberResponseDTO>> updateLinkedAccounts(Authentication authentication, @RequestBody List<LinkedAccountDTO> linkedAccounts) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Linked accounts updated successfully", memberservice.updateLinkedAccountsByUsername(authentication.getName(), linkedAccounts)), HttpStatus.OK);
    }

    @PatchMapping("/me/job-details")
    public ResponseEntity<APIResponse<MemberResponseDTO>> updateJobDetails(Authentication authentication, @RequestBody @Valid JobDetailsDTO dto) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Job details updated successfully", memberservice.updateJobDetailsByUsername(authentication.getName(), dto)), HttpStatus.OK);
    }
}
