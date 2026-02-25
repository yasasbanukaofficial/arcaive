package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.SubscriptionDTO;
import tech.yasasbanuka.backend.entity.Subscription;

@Mapper(config = CentralConfig.class)
public interface SubscriptionMapper {
    @Mapping(source = "id", target = "subscriptionId")
    @Mapping(source = "status", target = "subscriptionStatus")
    @Mapping(source = "member.id", target = "memberId")
    SubscriptionDTO toDto(Subscription subscription);

    @Mapping(source = "subscriptionId", target = "id")
    @Mapping(source = "subscriptionStatus", target = "status")
    @Mapping(target = "member", ignore = true)
    Subscription toEntity(SubscriptionDTO subscriptionDTO);

    @InheritConfiguration(name = "toEntity")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSubscription(SubscriptionDTO subscriptionDTO, @MappingTarget Subscription subscription);
}
