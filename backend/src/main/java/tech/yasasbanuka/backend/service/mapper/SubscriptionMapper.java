package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionCreateRequestDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionUpdateRequestDTO;
import tech.yasasbanuka.backend.entity.Subscription;

@Mapper(config = CentralConfig.class)
public interface SubscriptionMapper {
    @Mapping(source = "id", target = "subscriptionId")
    @Mapping(source = "status", target = "subscriptionStatus")
    @Mapping(source = "member.id", target = "memberId")
    SubscriptionResponseDTO toResponseDTO(Subscription subscription);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(source = "subscriptionStatus", target = "status", defaultValue = "inactive")
    Subscription createRequestToEntity(SubscriptionCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(source = "subscriptionStatus", target = "status")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateRequestToEntity(SubscriptionUpdateRequestDTO dto, @MappingTarget Subscription subscription);
}
