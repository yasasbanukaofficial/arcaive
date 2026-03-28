package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.usage.UsageEventCreateRequestDTO;
import tech.yasasbanuka.backend.dto.usage.UsageEventResponseDTO;
import tech.yasasbanuka.backend.entity.UsageEvent;

@Mapper(config = CentralConfig.class)
public interface UsageEventMapper {
    @Mapping(source = "member.id", target = "memberId")
    UsageEventResponseDTO toResponseDTO(UsageEvent usageEvent);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    UsageEvent createRequestToEntity(UsageEventCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateRequestToEntity(UsageEventCreateRequestDTO dto, @MappingTarget UsageEvent usageEvent);
}
