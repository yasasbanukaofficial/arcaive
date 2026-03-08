package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.member.*;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.Mfa;

@Mapper(config = CentralConfig.class)
public interface MemberMapper {

    @Mapping(source = "id", target = "memberId")
    @Mapping(source = "fullName", target = "memberFullName")
    @Mapping(source = "username", target = "memberUsername")
    @Mapping(source = "email", target = "memberEmail")
    @Mapping(expression = "java(member.getHashedPassword() != null)", target = "hasPassword")
    @Mapping(source = "tier", target = "memberTier")
    @Mapping(source = "subscription.id", target = "subscriptionId")
    @Mapping(source = "linkedAccounts", target = "linkedAccounts")
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    MemberResponseDTO toResponseDTO(Member member);

    @Mapping(source = "memberFullName", target = "fullName")
    @Mapping(source = "memberEmail", target = "email")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "hashedPassword", ignore = true)
    @Mapping(target = "tier", constant = "STARTER")
    @Mapping(target = "mfa", ignore = true)
    @Mapping(target = "linkedAccounts", ignore = true)
    @Mapping(target = "subscription", ignore = true)
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    Member createRequestToEntity(MemberCreateRequestDTO dto);

    @Mapping(source = "memberFullName", target = "fullName")
    @Mapping(source = "memberUsername", target = "username")
    @Mapping(source = "memberEmail", target = "email")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hashedPassword", ignore = true)
    @Mapping(target = "tier", ignore = true)
    @Mapping(target = "mfa", ignore = true)
    @Mapping(target = "linkedAccounts", ignore = true)
    @Mapping(target = "subscription", ignore = true)
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateRequestToEntity(MemberUpdateRequestDTO dto, @MappingTarget Member member);

    @Mapping(source = "memberId", target = "id")
    @Mapping(source = "memberFullName", target = "fullName")
    @Mapping(source = "memberUsername", target = "username")
    @Mapping(source = "memberEmail", target = "email")
    @Mapping(source = "password", target = "hashedPassword")
    @Mapping(source = "memberTier", target = "tier", defaultValue = "STARTER")
    @Mapping(source = "subscriptionId", target = "subscription.id")
    @Mapping(source = "linkedAccounts", target = "linkedAccounts")
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    Member internalDtoToEntity(MemberInternalDTO dto);

    @Mapping(source = "id", target = "memberId")
    @Mapping(source = "fullName", target = "memberFullName")
    @Mapping(source = "username", target = "memberUsername")
    @Mapping(source = "email", target = "memberEmail")
    @Mapping(expression = "java(member.getHashedPassword() != null ? \"\" : null)", target = "password")
    @Mapping(source = "tier", target = "memberTier")
    @Mapping(source = "subscription.id", target = "subscriptionId")
    @Mapping(source = "linkedAccounts", target = "linkedAccounts")
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    MemberInternalDTO toInternalDTO(Member member);

    @InheritConfiguration(name = "internalDtoToEntity")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "hashedPassword", ignore = true)
    void updateFromInternalDTO(MemberInternalDTO dto, @MappingTarget Member member);

    MfaUpdateRequestDTO mfaToMfaDto(Mfa mfa);

    @Mapping(source = "enabled", target = "enabled", defaultValue = "false")
    @Mapping(source = "method", target = "method", defaultValue = "email")
    Mfa mfaDtoToMfa(MfaUpdateRequestDTO dto);
}
