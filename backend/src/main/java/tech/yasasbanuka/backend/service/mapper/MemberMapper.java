package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.dto.MfaDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.Mfa;

@Mapper(config = CentralConfig.class)
public interface MemberMapper {
    @Mapping(source = "id", target = "memberId")
    @Mapping(source = "fullName", target = "memberFullName")
    @Mapping(source = "username", target = "memberUsername")
    @Mapping(source = "email", target = "memberEmail")
    @Mapping(target = "password", ignore = true)
    @Mapping(source = "tier", target = "memberTier")
    @Mapping(source = "subscription.id", target = "subscriptionId")
    MemberDTO toDTO(Member member);

    @Mapping(source = "memberId", target = "id")
    @Mapping(source = "memberFullName", target = "fullName")
    @Mapping(source = "memberUsername", target = "username")
    @Mapping(source = "memberEmail", target = "email")
    @Mapping(source = "password", target = "hashedPassword")
    @Mapping(source = "memberTier", target = "tier", defaultValue = "STARTER")
    @Mapping(source ="subscriptionId", target = "subscription.id")
    Member toEntity(MemberDTO member);

    MfaDTO mfaToMfaDto(Mfa mfa);
    @Mapping(source = "enabled", target = "enabled", defaultValue = "false")
    @Mapping(source = "method", target = "method", defaultValue = "email")
    Mfa mfaDtoToMfa(MfaDTO mfaDTO);

    @InheritConfiguration(name = "toEntity")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateMember(MemberDTO memberDTO, @MappingTarget Member member);
}