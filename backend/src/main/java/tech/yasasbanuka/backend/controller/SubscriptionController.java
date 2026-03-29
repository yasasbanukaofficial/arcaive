package tech.yasasbanuka.backend.controller;

import com.stripe.param.checkout.SessionCreateParams;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionCreateRequestDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionUpdateRequestDTO;
import tech.yasasbanuka.backend.entity.constants.Tier;
import tech.yasasbanuka.backend.service.SubscriptionService;
import tech.yasasbanuka.backend.util.APIResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
@Slf4j
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @PostMapping()
    public ResponseEntity<APIResponse<Map<String, String>>> createCheckout(@RequestParam Tier tier, Authentication authentication) {
        String username = authentication.getName();
        log.info("Request to create a checkout for the tier of {} to the user {}", tier, username);
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched all subscriptions successfully", subscriptionService.createCheckout(tier, authentication.getName())), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<SubscriptionResponseDTO>>> getAllSubscriptions() {
        log.info("Received request to fetch all subscriptions");
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched all subscriptions successfully", subscriptionService.getAllSubscriptions()), HttpStatus.OK);
    }

    @GetMapping("/{subscriptionId}")
    public ResponseEntity<APIResponse<SubscriptionResponseDTO>> getSubscription(@PathVariable UUID subscriptionId) {
        log.info("Received request to fetch subscription with ID: {}", subscriptionId);
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched subscription successfully", subscriptionService.getSubscription(subscriptionId)), HttpStatus.OK);
    }

    @PutMapping("/{subscriptionId}")
    public ResponseEntity<APIResponse<SubscriptionResponseDTO>> updateSubscription(@PathVariable UUID subscriptionId, @RequestBody @Valid SubscriptionUpdateRequestDTO dto) {
        log.info("Received request to update subscription with ID: {}", subscriptionId);
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Subscription updated successfully", subscriptionService.updateSubscription(subscriptionId, dto)), HttpStatus.OK);
    }

    @DeleteMapping("/{subscriptionId}")
    public ResponseEntity<APIResponse<Boolean>> deleteSubscription(@PathVariable UUID subscriptionId) {
        log.info("Received request to delete subscription with ID: {}", subscriptionId);
        subscriptionService.deleteSubscription(subscriptionId);
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Subscription deleted successfully", null), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<APIResponse<SubscriptionResponseDTO>> createSubscription(@RequestBody @Valid SubscriptionCreateRequestDTO dto) {
        log.info("Received request to create subscription for member ID: {}", dto.getMemberId());
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.CREATED.value(), "Subscription created successfully", subscriptionService.createSubscription(dto)), HttpStatus.CREATED);
    }
}
