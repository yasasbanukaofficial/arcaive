package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.tier.TierConfigCreateRequestDTO;
import tech.yasasbanuka.backend.dto.tier.TierConfigResponseDTO;
import tech.yasasbanuka.backend.entity.TierConfig;

@Mapper(config = CentralConfig.class)
public interface TierConfigMapper {
    TierConfigResponseDTO toResponseDTO(TierConfig tierConfig);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    TierConfig createRequestToEntity(TierConfigCreateRequestDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateRequestToEntity(TierConfigCreateRequestDTO dto, @MappingTarget TierConfig tierConfig);
}
