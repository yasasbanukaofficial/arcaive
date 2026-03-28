package tech.yasasbanuka.backend.service.mapper;

import org.mapstruct.*;
import tech.yasasbanuka.backend.config.CentralConfig;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionCreateRequestDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionUpdateRequestDTO;
import tech.yasasbanuka.backend.entity.Subscription;

@Mapper(config = CentralConfig.class)
public interface SubscriptionMapper {
    @Mapping(source = "member.id", target = "memberId")
    SubscriptionResponseDTO toResponseDTO(Subscription subscription);

    @Mapping(source = "memberId", target = "member.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cancelledAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Subscription createRequestToEntity(SubscriptionCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "memberId", target = "member.id")
    @Mapping(source = "subscriptionStatus", target = "status")
    @Mapping(source = "providerId", target = "externalSubscriptionId")
    @Mapping(source = "renewsAt", target = "currentPeriodEnd")
    @Mapping(source = "endsAt", target = "cancelledAt")
    @Mapping(target = "tier", ignore = true)
    @Mapping(target = "billingCycle", ignore = true)
    @Mapping(target = "priceAmount", ignore = true)
    @Mapping(target = "currency", ignore = true)
    @Mapping(target = "startedAt", ignore = true)
    @Mapping(target = "currentPeriodStart", ignore = true)
    @Mapping(target = "paymentProvider", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateRequestToEntity(SubscriptionUpdateRequestDTO dto, @MappingTarget Subscription subscription);
}
