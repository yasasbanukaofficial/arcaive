package tech.yasasbanuka.backend.service.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.member.*;
import tech.yasasbanuka.backend.dto.profile.EducationDTO;
import tech.yasasbanuka.backend.dto.profile.ExperienceDTO;
import tech.yasasbanuka.backend.dto.profile.ProjectDTO;
import tech.yasasbanuka.backend.dto.profile.SkillCategoryDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.embeddable.*;

import java.util.ArrayList;
import java.util.List;

@Mapper(config = CentralConfig.class)
public interface MemberMapper {
    ObjectMapper LIST_MAPPER = new ObjectMapper();

    @Mapping(source = "id", target = "memberId")
    @Mapping(source = "fullName", target = "memberFullName")
    @Mapping(source = "username", target = "memberUsername")
    @Mapping(source = "email", target = "memberEmail")
    @Mapping(expression = "java(member.getHashedPassword() != null)", target = "hasPassword")
    @Mapping(source = "subscription.id", target = "subscriptionId")
    @Mapping(target = "linkedAccounts", ignore = true)
    @Mapping(source = "jobRole", target = "profile.jobRole")
    @Mapping(source = "experience", target = "profile.experience")
    @Mapping(source = "country", target = "profile.country")
    @Mapping(source = "location", target = "profile.location")
    @Mapping(source = "phone", target = "profile.phone")
    @Mapping(source = "summary", target = "profile.summary")
    @Mapping(source = "experiences", target = "profile.experiences")
    @Mapping(source = "educations", target = "profile.educations")
    @Mapping(source = "projects", target = "profile.projects")
    @Mapping(source = "skills", target = "profile.skills")
    @Mapping(source = "certifications", target = "profile.certifications")
    @Mapping(source = "languages", target = "profile.languages")
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
    @Mapping(source = "phone", target = "phone")
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
    @Mapping(source = "phone", target = "phone")
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
    @Mapping(source = "phone", target = "phone")
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
    @Mapping(source = "location", target = "location")
    @Mapping(source = "phone", target = "phone")
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

    default Experience toExperience(ExperienceDTO dto) {
        if (dto == null) {
            return null;
        }

        return Experience.builder()
                .role(dto.getRole())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .period(dto.getPeriod())
                .bullets(toJsonList(dto.getBullets()))
                .build();
    }

    default ExperienceDTO toExperienceDTO(Experience entity) {
        if (entity == null) {
            return null;
        }

        return ExperienceDTO.builder()
                .role(entity.getRole())
                .company(entity.getCompany())
                .location(entity.getLocation())
                .period(entity.getPeriod())
                .bullets(fromJsonList(entity.getBullets()))
                .build();
    }

    Education toEducation(EducationDTO dto);
    EducationDTO toEducationDTO(Education entity);

    default Project toProject(ProjectDTO dto) {
        if (dto == null) {
            return null;
        }

        return Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .bullets(toJsonList(dto.getBullets()))
                .year(dto.getYear())
                .build();
    }

    default ProjectDTO toProjectDTO(Project entity) {
        if (entity == null) {
            return null;
        }

        return ProjectDTO.builder()
                .name(entity.getName())
                .description(entity.getDescription())
                .bullets(fromJsonList(entity.getBullets()))
                .year(entity.getYear())
                .build();
    }

    default SkillCategory toSkillCategory(SkillCategoryDTO dto) {
        if (dto == null) {
            return null;
        }

        return SkillCategory.builder()
                .category(dto.getCategory())
                .items(toJsonList(dto.getItems()))
                .build();
    }

    default SkillCategoryDTO toSkillCategoryDTO(SkillCategory entity) {
        if (entity == null) {
            return null;
        }

        return SkillCategoryDTO.builder()
                .category(entity.getCategory())
                .items(fromJsonList(entity.getItems()))
                .build();
    }

    default String toJsonList(List<String> values) {
        if (values == null) {
            return null;
        }

        try {
            return LIST_MAPPER.writeValueAsString(values);
        } catch (Exception ignored) {
            return "[]";
        }
    }

    default List<String> fromJsonList(String values) {
        if (values == null || values.isBlank()) {
            return new ArrayList<>();
        }

        try {
            return LIST_MAPPER.readValue(values, new TypeReference<List<String>>() {});
        } catch (Exception ignored) {
            return new ArrayList<>();
        }
    }
}
