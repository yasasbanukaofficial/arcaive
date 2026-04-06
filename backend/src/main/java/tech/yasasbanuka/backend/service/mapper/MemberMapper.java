package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.member.*;
import tech.yasasbanuka.backend.dto.profile.EducationDTO;
import tech.yasasbanuka.backend.dto.profile.ExperienceDTO;
import tech.yasasbanuka.backend.dto.profile.ProjectDTO;
import tech.yasasbanuka.backend.dto.profile.SkillCategoryDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.embeddable.*;

@Mapper(config = CentralConfig.class)
public interface MemberMapper {

    @Mapping(source = "id", target = "memberId")
    @Mapping(source = "fullName", target = "memberFullName")
    @Mapping(source = "username", target = "memberUsername")
    @Mapping(source = "email", target = "memberEmail")
    @Mapping(expression = "java(member.getHashedPassword() != null)", target = "hasPassword")
    @Mapping(source = "subscription.id", target = "subscriptionId")
    @Mapping(target = "linkedAccounts", ignore = true)
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    @Mapping(source = "location", target = "location")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "summary", target = "summary")
    @Mapping(source = "experiences", target = "experiences")
    @Mapping(source = "educations", target = "educations")
    @Mapping(source = "projects", target = "projects")
    @Mapping(source = "skills", target = "skills")
    @Mapping(source = "certifications", target = "certifications")
    @Mapping(source = "languages", target = "languages")
    MemberResponseDTO toResponseDTO(Member member);

    @Mapping(source = "memberFullName", target = "fullName")
    @Mapping(source = "memberEmail", target = "email")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "hashedPassword", ignore = true)
    @Mapping(target = "mfa", ignore = true)
    @Mapping(target = "linkedAccounts", ignore = true)
    @Mapping(target = "subscription", ignore = true)
    @Mapping(target = "usageQuota", ignore = true)
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    @Mapping(source = "location", target = "location")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "summary", target = "summary")
    @Mapping(source = "experiences", target = "experiences")
    @Mapping(source = "educations", target = "educations")
    @Mapping(source = "projects", target = "projects")
    @Mapping(source = "skills", target = "skills")
    @Mapping(source = "certifications", target = "certifications")
    @Mapping(source = "languages", target = "languages")
    Member createRequestToEntity(MemberCreateRequestDTO dto);

    @Mapping(source = "memberFullName", target = "fullName")
    @Mapping(source = "memberUsername", target = "username")
    @Mapping(source = "memberEmail", target = "email")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hashedPassword", ignore = true)
    @Mapping(target = "mfa", ignore = true)
    @Mapping(target = "linkedAccounts", ignore = true)
    @Mapping(target = "subscription", ignore = true)
    @Mapping(target = "usageQuota", ignore = true)
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    @Mapping(source = "location", target = "location")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "summary", target = "summary")
    @Mapping(source = "experiences", target = "experiences")
    @Mapping(source = "educations", target = "educations")
    @Mapping(source = "projects", target = "projects")
    @Mapping(source = "skills", target = "skills")
    @Mapping(source = "certifications", target = "certifications")
    @Mapping(source = "languages", target = "languages")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateRequestToEntity(MemberUpdateRequestDTO dto, @MappingTarget Member member);

    @Mapping(source = "memberId", target = "id")
    @Mapping(source = "memberFullName", target = "fullName")
    @Mapping(source = "memberUsername", target = "username")
    @Mapping(source = "memberEmail", target = "email")
    @Mapping(source = "password", target = "hashedPassword")
    @Mapping(target = "subscription", ignore = true)
    @Mapping(source = "linkedAccounts", target = "linkedAccounts")
    @Mapping(target = "usageQuota", ignore = true)
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    @Mapping(source = "location", target = "location")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "summary", target = "summary")
    @Mapping(source = "experiences", target = "experiences")
    @Mapping(source = "educations", target = "educations")
    @Mapping(source = "projects", target = "projects")
    @Mapping(source = "skills", target = "skills")
    @Mapping(source = "certifications", target = "certifications")
    @Mapping(source = "languages", target = "languages")
    Member internalDtoToEntity(MemberInternalDTO dto);

    @Mapping(source = "id", target = "memberId")
    @Mapping(source = "fullName", target = "memberFullName")
    @Mapping(source = "username", target = "memberUsername")
    @Mapping(source = "email", target = "memberEmail")
    @Mapping(expression = "java(member.getHashedPassword() != null ? \"\" : null)", target = "password")
    @Mapping(source = "subscription.id", target = "subscriptionId")
    @Mapping(source = "linkedAccounts", target = "linkedAccounts")
    @Mapping(source = "jobRole", target = "jobRole")
    @Mapping(source = "experience", target = "experience")
    @Mapping(source = "country", target = "country")
    @Mapping(source = "summary", target = "summary")
    @Mapping(source = "experiences", target = "experiences")
    @Mapping(source = "educations", target = "educations")
    @Mapping(source = "projects", target = "projects")
    @Mapping(source = "skills", target = "skills")
    @Mapping(source = "certifications", target = "certifications")
    @Mapping(source = "languages", target = "languages")
    MemberInternalDTO toInternalDTO(Member member);

    @InheritConfiguration(name = "internalDtoToEntity")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "hashedPassword", ignore = true)
    void updateFromInternalDTO(MemberInternalDTO dto, @MappingTarget Member member);

    MfaUpdateRequestDTO mfaToMfaDto(Mfa mfa);

    @Mapping(source = "enabled", target = "enabled", defaultValue = "false")
    @Mapping(source = "method", target = "method", defaultValue = "email")
    Mfa mfaDtoToMfa(MfaUpdateRequestDTO dto);

    Experience toExperience(ExperienceDTO dto);
    ExperienceDTO toExperienceDTO(Experience entity);

    Education toEducation(EducationDTO dto);
    EducationDTO toEducationDTO(Education entity);

    Project toProject(ProjectDTO dto);
    ProjectDTO toProjectDTO(Project entity);

    SkillCategory toSkillCategory(SkillCategoryDTO dto);
    SkillCategoryDTO toSkillCategoryDTO(SkillCategory entity);
}
