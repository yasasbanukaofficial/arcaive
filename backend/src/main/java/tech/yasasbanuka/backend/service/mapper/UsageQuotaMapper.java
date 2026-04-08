package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.usage.UsageQuotaCreateRequestDTO;
import tech.yasasbanuka.backend.dto.usage.UsageQuotaResponseDTO;
import tech.yasasbanuka.backend.entity.UsageQuota;

@Mapper(config = CentralConfig.class)
public interface UsageQuotaMapper {
    @Mapping(source = "member.id", target = "memberId")
    UsageQuotaResponseDTO toResponseDTO(UsageQuota usageQuota);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "cvAnalysisUsed", ignore = true)
    @Mapping(target = "jobSearchUsed", ignore = true)
    @Mapping(target = "interviewUsed", ignore = true)
    @Mapping(target = "autoApplyUsed", ignore = true)
    @Mapping(target = "cvCreationsStored", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    UsageQuota createRequestToEntity(UsageQuotaCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "cvAnalysisUsed", ignore = true)
    @Mapping(target = "jobSearchUsed", ignore = true)
    @Mapping(target = "interviewUsed", ignore = true)
    @Mapping(target = "autoApplyUsed", ignore = true)
    @Mapping(target = "cvCreationsStored", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateRequestToEntity(UsageQuotaCreateRequestDTO dto, @MappingTarget UsageQuota usageQuota);
}
