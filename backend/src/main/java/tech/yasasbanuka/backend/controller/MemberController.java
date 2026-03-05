package tech.yasasbanuka.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.ChangePasswordDTO;
import tech.yasasbanuka.backend.dto.LinkedAccountDTO;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.dto.MfaDTO;
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
    public ResponseEntity<APIResponse<List<MemberDTO>>> getAllMembers(){
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched all members successfully", memberservice.getAllMembers()), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<APIResponse<MemberDTO>> getMember(Authentication authentication){
        String username = authentication.getName();
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched member successfully", memberservice.getMemberByUsername(username)), HttpStatus.OK);
    }

    @PutMapping("/me")
    public ResponseEntity<APIResponse<MemberDTO>> updateMember(Authentication authentication, @RequestBody @Valid MemberDTO member){
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Member updated successfully", memberservice.updateMemberByUsername(authentication.getName(), member)), HttpStatus.OK);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<APIResponse<Boolean>> deleteMember(@PathVariable UUID memberId) {
        memberservice.deleteMember(memberId);
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(),"Member deleted successfully", null), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<APIResponse<MemberDTO>> createMember(@RequestBody @Valid MemberDTO member){
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.CREATED.value(), "Member created successfully", memberservice.createMember(member)), HttpStatus.CREATED);
    }

    @PatchMapping("/me/password")
    public ResponseEntity<APIResponse<Void>> changePassword(Authentication authentication, @RequestBody @Valid ChangePasswordDTO dto){
        memberservice.changePassword(authentication.getName(), dto.getCurrentPassword(), dto.getNewPassword());
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Password updated successfully", null), HttpStatus.OK);
    }

    @PatchMapping("/me/mfa")
    public ResponseEntity<APIResponse<MemberDTO>> updateMfa(Authentication authentication, @RequestBody @Valid MfaDTO mfa){
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "MFA settings updated successfully", memberservice.updateMfaByUsername(authentication.getName(), mfa)), HttpStatus.OK);
    }

    @PatchMapping("/me/linked-accounts")
    public ResponseEntity<APIResponse<MemberDTO>> updateLinkedAccounts(Authentication authentication, @RequestBody List<LinkedAccountDTO> linkedAccounts){
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Linked accounts updated successfully", memberservice.updateLinkedAccountsByUsername(authentication.getName(), linkedAccounts)), HttpStatus.OK);
    }

}
