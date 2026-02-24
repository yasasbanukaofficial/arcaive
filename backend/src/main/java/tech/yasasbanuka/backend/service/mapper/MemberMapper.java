package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.entity.Member;

@Mapper(config = CentralConfig.class)
public interface MemberMapper {
    @Mapping(source = "id", target = "memberId")
    @Mapping(source = "fullName", target = "memberFullName")
    @Mapping(source = "username", target = "memberUsername")
    @Mapping(source = "email", target = "memberEmail")
    @Mapping(target = "password", ignore = true)
    @Mapping(source = "links", target = "socialLinks")
    MemberDTO toDTO(Member member);

    @Mapping(source = "memberId", target = "id")
    @Mapping(source = "memberFullName", target = "fullName")
    @Mapping(source = "memberUsername", target = "username")
    @Mapping(source = "memberEmail", target = "email")
    @Mapping(source = "password", target = "hashedPassword")
    @Mapping(source = "socialLinks", target = "links")
    Member toEntity(MemberDTO member);

    @InheritConfiguration(name = "toEntity")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateMember(MemberDTO memberDTO, @MappingTarget Member member);
}